import {MetadataStorage} from './metadata-storage';

let ORMMetadataStorage: MetadataStorage;

export function getMetadataStorage(): MetadataStorage {
	return (
		ORMMetadataStorage || (ORMMetadataStorage = new MetadataStorage())
	);
}
