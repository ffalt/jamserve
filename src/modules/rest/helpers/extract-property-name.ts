// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
function $args(func: any): Array<string> {
	return (func + '')
		.replace(/[/][/].*$/mg, '') // strip single-line comments
		.replace(/\s+/g, '') // strip white space
		.replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
		.split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
		.replace(/=[^,]+/g, '') // strip any ES6 defaults
		.split(',').filter(Boolean); // split & filter [""]
}

export function extractPropertyName(prototype: any, propertyKey: string | symbol, parameterIndex: number): string {
	return `${$args((prototype as any)[propertyKey].toString())[parameterIndex]}`;
}
