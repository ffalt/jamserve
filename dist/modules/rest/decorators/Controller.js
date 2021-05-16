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
            description: options?.description,
            roles: options?.roles,
            tags: options?.tags,
            abstract: options?.abstract,
            deprecationReason: options?.deprecationReason
        });
    };
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map