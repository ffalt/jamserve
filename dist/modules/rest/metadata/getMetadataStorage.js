import { MetadataStorage } from './metadata-storage.js';
let RESTMetadataStorage;
export function getMetadataStorage() {
    return (RESTMetadataStorage || (RESTMetadataStorage = new MetadataStorage()));
}
//# sourceMappingURL=getMetadataStorage.js.map