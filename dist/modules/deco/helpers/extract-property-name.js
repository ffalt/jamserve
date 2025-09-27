export function extractParameters(function_) {
    const functionString = function_.toString()
        .replaceAll(/[/][/].*$/mg, '')
        .replaceAll(/\s+/g, '')
        .replaceAll(/\/\*[\s\S]*?\*\//g, '');
    const pattern = /(?:function\s*)?(?:\w+\s*)?\(([^)]*)\)/;
    const matched = pattern.exec(functionString);
    return matched?.at(1)?.split(',')
        .map(parameter => parameter.replace(/=.*$/, '').trim())
        .filter(Boolean) ?? [];
}
export function extractPropertyName(prototype, propertyKey, parameterIndex) {
    const value = prototype[propertyKey];
    if (typeof value !== 'function') {
        return '';
    }
    const result = extractParameters(value);
    return result[parameterIndex] ?? '';
}
//# sourceMappingURL=extract-property-name.js.map