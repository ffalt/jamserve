"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEnumType = exports.getEnumReverseValuesMap = exports.getEnumValuesMap = void 0;
const metadata_1 = require("../metadata");
function getEnumValuesMap(enumObject) {
    const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
    return enumKeys.reduce((map, key) => {
        map[key] = enumObject[key];
        return map;
    }, {});
}
exports.getEnumValuesMap = getEnumValuesMap;
function getEnumReverseValuesMap(enumObject) {
    const enumKeys = Object.keys(enumObject).filter(key => isNaN(parseInt(key, 10)));
    return enumKeys.reduce((map, key) => {
        map[enumObject[key]] = key;
        return map;
    }, {});
}
exports.getEnumReverseValuesMap = getEnumReverseValuesMap;
function registerEnumType(enumObj, enumConfig) {
    metadata_1.getMetadataStorage().collectEnumMetadata({
        enumObj,
        name: enumConfig.name,
        description: enumConfig.description,
    });
}
exports.registerEnumType = registerEnumType;
//# sourceMappingURL=enums.js.map