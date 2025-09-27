import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';
let SUBSONICMetadataStorage;
export function metadataStorage() {
    SUBSONICMetadataStorage ?? (SUBSONICMetadataStorage = new MetadataStorage());
    return SUBSONICMetadataStorage;
}
//# sourceMappingURL=metadata-storage.js.map