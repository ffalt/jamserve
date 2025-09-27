import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';
let RESTMetadataStorage;
export function metadataStorage() {
    RESTMetadataStorage ?? (RESTMetadataStorage = new MetadataStorage());
    return RESTMetadataStorage;
}
//# sourceMappingURL=metadata-storage.js.map