import { TypeOptions } from '../definitions/types.js';

export function getDefaultValue(typeInstance: { [property: string]: unknown }, typeOptions: TypeOptions, fieldName: string): unknown | undefined {
	const defaultValueFromInitializer = typeInstance[fieldName];
	return typeOptions.defaultValue !== undefined ? typeOptions.defaultValue : defaultValueFromInitializer;
}
