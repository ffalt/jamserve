import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';
let SUBSONICMetadataStorage;
export function getMetadataStorage() {
    return (SUBSONICMetadataStorage || (SUBSONICMetadataStorage = new MetadataStorage()));
}
//# sourceMappingURL=getMetadataStorage.js.map