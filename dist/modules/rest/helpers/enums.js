"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumReverseValuesMap = exports.getEnumValuesMap = void 0;
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
//# sourceMappingURL=enums.js.map