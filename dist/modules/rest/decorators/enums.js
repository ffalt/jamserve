"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEnumType = void 0;
const metadata_1 = require("../metadata");
function registerEnumType(enumObj, enumConfig) {
    metadata_1.getMetadataStorage().collectEnumMetadata({
        enumObj,
        name: enumConfig.name,
        description: enumConfig.description,
    });
}
exports.registerEnumType = registerEnumType;
//# sourceMappingURL=enums.js.map