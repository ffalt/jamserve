export function getEnumReverseValuesMap(enumObject) {
    const enumKeys = Object.keys(enumObject).filter(key => Number.isNaN(Number.parseInt(key, 10)));
    const map = {};
    for (const key of enumKeys) {
        const value = String(enumObject[key]);
        map[value] = key;
    }
    return map;
}
export function registerEnumType(enumObj, enumConfig, enums) {
    enums.push({
        enumObj,
        name: enumConfig.name,
        description: enumConfig.description
    });
}
//# sourceMappingURL=enums.js.map