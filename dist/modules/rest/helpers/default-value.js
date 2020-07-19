"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultValue = void 0;
function getDefaultValue(typeInstance, typeOptions, fieldName) {
    const defaultValueFromInitializer = typeInstance[fieldName];
    return typeOptions.defaultValue !== undefined
        ? typeOptions.defaultValue
        : defaultValueFromInitializer;
}
exports.getDefaultValue = getDefaultValue;
//# sourceMappingURL=default-value.js.map