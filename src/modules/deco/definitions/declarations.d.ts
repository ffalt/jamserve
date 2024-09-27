declare namespace NodeJS {
  interface Global {
    JAMMetadataStorage: import("./metadata-storage.js").MetadataStorage;
  }
}
