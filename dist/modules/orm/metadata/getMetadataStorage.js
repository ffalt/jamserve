"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataStorage = void 0;
const metadata_storage_1 = require("./metadata-storage");
let ORMMetadataStorage;
function getMetadataStorage() {
    return (ORMMetadataStorage || (ORMMetadataStorage = new metadata_storage_1.MetadataStorage()));
}
exports.getMetadataStorage = getMetadataStorage;
//# sourceMappingURL=getMetadataStorage.js.map