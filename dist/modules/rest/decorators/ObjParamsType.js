"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjParamsType = void 0;
const metadata_1 = require("../metadata");
function ObjParamsType() {
    return target => {
        metadata_1.getMetadataStorage().collectArgsMetadata({
            name: target.name,
            target,
            fields: []
        });
    };
}
exports.ObjParamsType = ObjParamsType;
//# sourceMappingURL=ObjParamsType.js.map