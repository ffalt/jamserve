import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
export function registerEnumType(enumObj, enumConfig) {
    getMetadataStorage().enums.push({
        enumObj,
        name: enumConfig.name,
        description: enumConfig.description
    });
}
//# sourceMappingURL=enums.js.map