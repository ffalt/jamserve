import { CustomPathParameterGroup, CustomPathParameters } from '../definitions/types.js';
import { MethodMetadata } from '../definitions/method-metadata.js';
import { invalidParamError, missingParamError } from './express-error.js';
import { RestOptions } from './express-method.js';

function validateCustomPathParameterValue(rElement: string | undefined, group: CustomPathParameterGroup, options: RestOptions): any {
	const type = group.getType();
	let value: string = rElement || '';
	if (group.prefix) {
		value = value.replace(group.prefix, '').trim();
	}
	if (value.length === 0) {
		throw missingParamError(group.name);
	}
	switch (type) {
		case String: {
			return value;
		}
		case Boolean: {
			return Boolean(value);
		}
		case Number: {
			const number = Number(value);
			if (Number.isNaN(number)) {
				throw invalidParamError(group.name, 'is not a number');
			}
			if ((group.min !== undefined && number < group.min) ||
				(group.max !== undefined && number > group.max)) {
				throw invalidParamError(group.name, 'number not in allowed range');
			}
			return number;
		}
		default: {
			const enumInfo = options.enums.find(e => e.enumObj === type);
			if (enumInfo) {
				const enumObj: any = enumInfo.enumObj;
				if (!enumObj[value]) {
					throw invalidParamError(group.name, `Enum value not valid`);
				}
				return value;
			}
			throw new Error('Internal: Invalid Custom Path Parameter Type ' + group.name);
		}
	}
}

export function processCustomPathParameters(customPathParameters: CustomPathParameters, pathParameters: string, method: MethodMetadata, options: RestOptions): any {
	const r = customPathParameters.regex.exec(pathParameters) || [];
	let index = 1;
	const result: any = {};
	const route = '/' + customPathParameters.groups.filter((g, index) => r[index + 1]).map(g => `${g.prefix || ''}{${g.name}}`).join('');
	const alias = (method.aliasRoutes || []).find(a => a.route === route);
	for (const group of customPathParameters.groups) {
		if (!alias || !(alias.hideParameters || []).includes(group.name)) {
			result[group.name] = validateCustomPathParameterValue(r[index], group, options);
		}
		index++;
	}
	return result;
}
