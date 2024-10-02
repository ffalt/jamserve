declare namespace NodeJS {
	interface Global {
		JAMMetadataStorage: import('./metadata/metadata-storage.js').MetadataStorage;
	}
}
