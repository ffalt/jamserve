import { TypeOptions } from '../definitions/types.js';

export function getDefaultValue(typeInstance: Record<string, unknown>, typeOptions: TypeOptions, fieldName: string): unknown {
	const defaultValueFromInitializer = typeInstance[fieldName];
	return typeOptions.defaultValue === undefined ? defaultValueFromInitializer : typeOptions.defaultValue;
}
