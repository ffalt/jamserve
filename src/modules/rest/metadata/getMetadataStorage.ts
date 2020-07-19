import {MetadataStorage} from './metadata-storage';

let JAMMetadataStorage: MetadataStorage;

export function getMetadataStorage(): MetadataStorage {
	return (
		JAMMetadataStorage || (JAMMetadataStorage = new MetadataStorage())
	);
}
