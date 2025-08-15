// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
export function extractParameters(function_: Function): Array<string> {
	const functionString = function_.toString()
		.replaceAll(/[/][/].*$/mg, '') // strip single-line comments
		.replaceAll(/\s+/g, '') // strip white space
		.replaceAll(/\/\*[\s\S]*?\*\//g, ''); // strip multi-line comments

	const pattern = /(?:function\s*)?(?:\w+\s*)?\(([^)]*)\)/;
	const matched = pattern.exec(functionString);

	return matched?.[1]?.split(',')
		.map(parameter => parameter.replace(/=.*$/, '').trim()) // remove default values
		.filter(Boolean) ?? []; // filter empty strings
}

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export function extractPropertyName(prototype: Object, propertyKey: string, parameterIndex: number): string {
	// Safely access the member on the prototype
	const value: unknown = (prototype as Record<PropertyKey, unknown>)[propertyKey];
	// Ensure we only proceed if the value is a function
	if (typeof value !== 'function') {
		return '';
	}
	const result = extractParameters(value as Function);
	return result[parameterIndex] ?? '';
}
