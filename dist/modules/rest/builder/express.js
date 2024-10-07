import express from 'express';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import multer from 'multer';
import { ensureTrailingPathSeparator, fileDeleteIfExists } from '../../../utils/fs-utils.js';
import finishedRequest from 'on-finished';
import { ExpressMethod } from '../../deco/express/express-method.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';
export function restRouter(api, options) {
    const routeInfos = [];
    const upload = multer({ dest: ensureTrailingPathSeparator(options.tmpPath) });
    const metadata = getMetadataStorage();
    const method = new ExpressMethod();
    const registerAutoClean = (req, res) => {
        finishedRequest(res, err => {
            if (err && req.file && req.file.path) {
                fileDeleteIfExists(req.file.path).catch(e => {
                    console.error(e);
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
            mu(req, res, next);
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
            gets = gets.concat(metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass));
            posts = posts.concat(metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass));
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