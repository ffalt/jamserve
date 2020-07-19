"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRestMeta = void 0;
const metadata_1 = require("../metadata");
function buildRestMeta(controllers) {
    controllers.forEach((controller) => {
        new controller();
    });
    const metadata = metadata_1.getMetadataStorage();
    metadata.build();
}
exports.buildRestMeta = buildRestMeta;
//# sourceMappingURL=builder.js.map