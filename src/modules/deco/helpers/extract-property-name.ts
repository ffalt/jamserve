// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
export function $args(func: Function): Array<string> {
	const functionStr = (func + '')
		.replace(/[/][/].*$/mg, '') // strip single-line comments
		.replace(/\s+/g, '') // strip white space
		.replace(/\/\*[\s\S]*?\*\//g, ''); // strip multi-line comments

	const pattern = /(?:function\s*)?(?:\w+\s*)?\(([^)]*)\)/;
	const matched = pattern.exec(functionStr);

	return matched?.[1]?.split(',')
		.map(param => param.replace(/=.*$/, '').trim()) // remove default values
		.filter(Boolean) ?? []; // filter empty strings
}

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export function extractPropertyName(prototype: Object, propertyKey: string | symbol | undefined, parameterIndex: number): string {
	return `${$args((prototype as any)[propertyKey ?? ''].toString())[parameterIndex]}`;
}
