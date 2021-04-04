"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restRouter = void 0;
const express_1 = __importDefault(require("express"));
const metadata_1 = require("../metadata");
const multer_1 = __importDefault(require("multer"));
const fs_utils_1 = require("../../../utils/fs-utils");
const on_finished_1 = __importDefault(require("on-finished"));
const express_method_1 = require("./express-method");
const iterate_super_1 = require("../helpers/iterate-super");
function restRouter(api, options) {
    const routeInfos = [];
    const upload = multer_1.default({ dest: fs_utils_1.ensureTrailingPathSeparator(options.tmpPath) });
    const metadata = metadata_1.getMetadataStorage();
    const method = new express_method_1.ExpressMethod();
    const registerAutoClean = (req, res) => {
        on_finished_1.default(res, err => {
            if (err && req.file && req.file.path) {
                fs_utils_1.fileDeleteIfExists(req.file.path).catch(e => {
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
        const router = express_1.default.Router();
        let gets = [];
        let posts = [];
        iterate_super_1.iterateControllers(metadata, ctrl, (ctrlClass => {
            gets = gets.concat(metadata.gets.filter(g => g.controllerClassMetadata === ctrlClass));
            posts = posts.concat(metadata.posts.filter(g => g.controllerClassMetadata === ctrlClass));
        }));
        for (const get of gets) {
            routeInfos.push(method.GET(get, ctrl, router, options));
        }
        for (const post of posts) {
            routeInfos.push(method.POST(post, ctrl, router, options, uploadHandler));
        }
        api.use(ctrl.route, router);
    }
    return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}
exports.restRouter = restRouter;
//# sourceMappingURL=express.js.map