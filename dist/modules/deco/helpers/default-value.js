export function getDefaultValue(typeInstance, typeOptions, fieldName) {
    const defaultValueFromInitializer = typeInstance[fieldName];
    return typeOptions.defaultValue === undefined ? defaultValueFromInitializer : typeOptions.defaultValue;
}
//# sourceMappingURL=default-value.js.map