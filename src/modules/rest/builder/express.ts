import express from 'express';
import { metadataStorage } from '../metadata/metadata-storage.js';
import multer from 'multer';
import { ensureTrailingPathSeparator, fileDeleteIfExists } from '../../../utils/fs-utils.js';
import finishedRequest from 'on-finished';
import { ExpressMethod, RestOptions, RouteInfo } from '../../deco/express/express-method.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';

// File type validation helper
function validateUploadedFile(file: Express.Multer.File): void {
	const ALLOWED_MIME_TYPES = [
		'image/jpeg',
		'image/png',
		'image/webp',
		'image/gif'
	];

	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for images

	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
	}

	// Check mime type from multer
	if (!ALLOWED_MIME_TYPES.includes(file.mimetype || '')) {
		throw new Error(
			`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}. ` +
			`Detected: ${file.mimetype || 'unknown'}`
		);
	}
}

export function restRouter(api: express.Router, options: RestOptions): Array<RouteInfo> {
	const routeInfos: Array<RouteInfo> = [];
	const upload = multer({
		dest: ensureTrailingPathSeparator(options.tmpPath),
		limits: {
			fileSize: 50 * 1024 * 1024 // 50MB max per file
		}
	});
	const metadata = metadataStorage();
	const method = new ExpressMethod();

	const registerAutoClean = (req: express.Request, res: express.Response): void => {
		finishedRequest(res, error => {
			if (error && req.file?.path) {
				fileDeleteIfExists(req.file.path)
					.catch((removeError: unknown) => {
						console.error(removeError);
					});
			}
		});
	};

	const uploadHandler = (field: string, autoClean: boolean = true): express.RequestHandler => {
		const mu = upload.single(field);
		return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
			if (autoClean) {
				registerAutoClean(req, res);
			}
			// Validate uploaded file after multer processes it
			void mu(req, res, (error: unknown) => {
				if (error) {
					next(error);
					return;
				}

				if (req.file) {
					try {
						validateUploadedFile(req.file);
						next();
					} catch (validationError) {
						// Clean up rejected file and handle any cleanup errors
						const filePath = req.file.path;
						fileDeleteIfExists(filePath)
							.then(() => {
								next(validationError);
							})
							.catch((removeError: unknown) => {
								console.error('Failed to clean up rejected upload file:', removeError);
								next(validationError);
							});
					}
				} else {
					next();
				}
			});
		};
	};

	for (const ctrl of metadata.controllerClasses) {
		if (ctrl.abstract) {
			continue;
		}
		const router = express.Router();
		let gets: Array<MethodMetadata> = [];
		let posts: Array<MethodMetadata> = [];
		iterateControllers(metadata.controllerClasses, ctrl, ctrlClass => {
			gets = [...gets, ...metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass)];
			posts = [...posts, ...metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass)];
		});
		for (const get of gets) {
			routeInfos.push(method.GET(get, ctrl, router, options, metadata));
		}
		for (const post of posts) {
			routeInfos.push(method.POST(post, ctrl, router, options, uploadHandler, metadata));
		}
		api.use(ctrl.route, router);
	}
	return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}
