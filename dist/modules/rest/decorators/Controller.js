"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const metadata_1 = require("../metadata");
function extractClassName(target) {
    const s = target.toString().split(' ');
    return s[1];
}
function Controller(route, options) {
    return (target) => {
        metadata_1.getMetadataStorage().collectControllerClassMetadata({
            target,
            route,
            name: extractClassName(target),
            description: options === null || options === void 0 ? void 0 : options.description,
            roles: options === null || options === void 0 ? void 0 : options.roles,
            tags: options === null || options === void 0 ? void 0 : options.tags,
            abstract: options === null || options === void 0 ? void 0 : options.abstract,
            deprecationReason: options === null || options === void 0 ? void 0 : options.deprecationReason
        });
    };
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map