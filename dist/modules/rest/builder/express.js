import express from 'express';
import { metadataStorage } from '../metadata/metadata-storage.js';
import multer from 'multer';
import { ensureTrailingPathSeparator, fileDeleteIfExists } from '../../../utils/fs-utils.js';
import finishedRequest from 'on-finished';
import { ExpressMethod } from '../../deco/express/express-method.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';
import { logger } from '../../../utils/logger.js';
const log = logger('ExpressRestBuilder');
function validateUploadedFile(file) {
    const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif'
    ];
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype || '')) {
        throw new Error(`Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}. ` +
            `Detected: ${file.mimetype || 'unknown'}`);
    }
}
export function restRouter(api, options) {
    const routeInfos = [];
    const upload = multer({
        dest: ensureTrailingPathSeparator(options.tmpPath),
        limits: {
            fileSize: 50 * 1024 * 1024
        }
    });
    const metadata = metadataStorage();
    const method = new ExpressMethod();
    const registerAutoClean = (req, res) => {
        finishedRequest(res, error => {
            if (error && req.file?.path) {
                fileDeleteIfExists(req.file.path)
                    .catch((removeError) => {
                    log.error(removeError);
                });
            }
        });
    };
    const uploadHandler = (field, autoClean = true) => {
        const mu = upload.single(field);
        return (req, res, next) => {
            if (autoClean) {
                registerAutoClean(req, res);
            }
            void mu(req, res, (error) => {
                if (error) {
                    next(error);
                    return;
                }
                if (req.file) {
                    try {
                        validateUploadedFile(req.file);
                        next();
                    }
                    catch (validationError) {
                        const filePath = req.file.path;
                        fileDeleteIfExists(filePath)
                            .then(() => {
                            next(validationError);
                        })
                            .catch((removeError) => {
                            log.errorMsg('Failed to clean up rejected upload file:', removeError);
                            next(validationError);
                        });
                    }
                }
                else {
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
        let gets = [];
        let posts = [];
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
//# sourceMappingURL=express.js.map