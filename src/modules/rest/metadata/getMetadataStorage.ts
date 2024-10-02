import { MetadataStorage } from './metadata-storage.js';

let RESTMetadataStorage: MetadataStorage;

export function getMetadataStorage(): MetadataStorage {
	return (
		RESTMetadataStorage || (RESTMetadataStorage = new MetadataStorage())
	);
}
