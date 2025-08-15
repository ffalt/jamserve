import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';

let RESTMetadataStorage: MetadataStorage | undefined;

export function metadataStorage(): MetadataStorage {
	RESTMetadataStorage ??= new MetadataStorage();
	return RESTMetadataStorage;
}
