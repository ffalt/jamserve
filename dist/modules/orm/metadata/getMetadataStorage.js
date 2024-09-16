import { MetadataStorage } from './metadata-storage.js';
let ORMMetadataStorage;
export function getMetadataStorage() {
    return (ORMMetadataStorage || (ORMMetadataStorage = new MetadataStorage()));
}
//# sourceMappingURL=getMetadataStorage.js.map