export function getDefaultValue(typeInstance, typeOptions, fieldName) {
    const defaultValueFromInitializer = typeInstance[fieldName];
    return typeOptions.defaultValue !== undefined ? typeOptions.defaultValue : defaultValueFromInitializer;
}
//# sourceMappingURL=default-value.js.map