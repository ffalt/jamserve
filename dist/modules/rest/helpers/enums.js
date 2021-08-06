import { getMetadataStorage } from '../metadata';
export function getEnumReverseValuesMap(enumObject) {
    const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
    return enumKeys.reduce((map, key) => {
        map[enumObject[key]] = key;
        return map;
    }, {});
}
export function registerEnumType(enumObj, enumConfig) {
    getMetadataStorage().collectEnumMetadata({
        enumObj,
        name: enumConfig.name,
        description: enumConfig.description,
    });
}
//# sourceMappingURL=enums.js.map