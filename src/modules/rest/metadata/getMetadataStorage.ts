import {MetadataStorage} from './metadata-storage';

let RESTMetadataStorage: MetadataStorage;

export function getMetadataStorage(): MetadataStorage {
	return (
		RESTMetadataStorage || (RESTMetadataStorage = new MetadataStorage())
	);
}
