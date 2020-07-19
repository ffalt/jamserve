"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPropertyName = void 0;
function $args(func) {
    return (func + '')
        .replace(/[/][/].*$/mg, '')
        .replace(/\s+/g, '')
        .replace(/[/][*][^/*]*[*][/]/g, '')
        .split('){', 1)[0].replace(/^[^(]*[(]/, '')
        .replace(/=[^,]+/g, '')
        .split(',').filter(Boolean);
}
function extractPropertyName(prototype, propertyKey, parameterIndex) {
    return `${$args(prototype[propertyKey].toString())[parameterIndex]}`;
}
exports.extractPropertyName = extractPropertyName;
//# sourceMappingURL=extract-property-name.js.map