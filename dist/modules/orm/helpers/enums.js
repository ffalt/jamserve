import { getMetadataStorage } from '../metadata';
export function registerEnumType(enumObj, enumConfig) {
    getMetadataStorage().collectEnumMetadata({
        enumObj,
        name: enumConfig.name,
        description: enumConfig.description,
    });
}
//# sourceMappingURL=enums.js.map