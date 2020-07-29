"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadataStorage = void 0;
const metadata_storage_1 = require("./metadata-storage");
let RESTMetadataStorage;
function getMetadataStorage() {
    return (RESTMetadataStorage || (RESTMetadataStorage = new metadata_storage_1.MetadataStorage()));
}
exports.getMetadataStorage = getMetadataStorage;
//# sourceMappingURL=getMetadataStorage.js.map