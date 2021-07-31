function $args(func) {
    return (func + '')
        .replace(/[/][/].*$/mg, '')
        .replace(/\s+/g, '')
        .replace(/[/][*][^/*]*[*][/]/g, '')
        .split('){', 1)[0].replace(/^[^(]*[(]/, '')
        .replace(/=[^,]+/g, '')
        .split(',').filter(Boolean);
}
export function extractPropertyName(prototype, propertyKey, parameterIndex) {
    return `${$args(prototype[propertyKey].toString())[parameterIndex]}`;
}
//# sourceMappingURL=extract-property-name.js.map