import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';
let RESTMetadataStorage;
export function getMetadataStorage() {
    return (RESTMetadataStorage || (RESTMetadataStorage = new MetadataStorage()));
}
//# sourceMappingURL=getMetadataStorage.js.map