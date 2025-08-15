import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';

let SUBSONICMetadataStorage: MetadataStorage | undefined;

export function metadataStorage(): MetadataStorage {
	SUBSONICMetadataStorage ??= new MetadataStorage();
	return SUBSONICMetadataStorage;
}
