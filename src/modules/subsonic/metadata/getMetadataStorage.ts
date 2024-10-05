import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';

let SUBSONICMetadataStorage: MetadataStorage;

export function getMetadataStorage(): MetadataStorage {
	return (
		SUBSONICMetadataStorage || (SUBSONICMetadataStorage = new MetadataStorage())
	);
}
