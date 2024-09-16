import {MetadataStorage} from './metadata-storage.js';

let ORMMetadataStorage: MetadataStorage;

export function getMetadataStorage(): MetadataStorage {
	return (
		ORMMetadataStorage || (ORMMetadataStorage = new MetadataStorage())
	);
}
