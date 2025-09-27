import { metadataStorage } from '../metadata/metadata-storage.js';
export function registerEnumType(enumObj, enumConfig) {
    metadataStorage().enums.push({
        enumObj,
        name: enumConfig.name,
        description: enumConfig.description
    });
}
//# sourceMappingURL=enums.js.map