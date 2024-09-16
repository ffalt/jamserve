import {CustomPathParameterGroup, CustomPathParameters} from '../definitions/types.js';
import {MethodMetadata} from '../definitions/method-metadata.js';
import {InvalidParamError, MissingParamError} from './express-error.js';
import {getMetadataStorage} from '../metadata/getMetadataStorage.js';

function validateCustomPathParameterValue(rElement: string | undefined, group: CustomPathParameterGroup): any {
	const type = group.getType();
	let value: string = rElement || '';
	if (group.prefix) {
		value = value.replace(group.prefix, '').trim();
	}
	if (value.length === 0) {
		throw MissingParamError(group.name);
	}
	if (type === String) {
		return value;
	} else if (type === Boolean) {
		return Boolean(value);
	} else if (type === Number) {
		const number = Number(value);
		if (isNaN(number)) {
			throw InvalidParamError(group.name, 'is not a number');
		}
		if ((group.min !== undefined && number < group.min) ||
			(group.max !== undefined && number > group.max)) {
			throw InvalidParamError(group.name, 'number not in allowed range');
		}
		return number;
	} else {
		const enumInfo = getMetadataStorage().enums.find(e => e.enumObj === type);
		if (enumInfo) {
			const enumObj: any = enumInfo.enumObj;
			if (!enumObj[value]) {
				throw InvalidParamError(group.name, `Enum value not valid`);
			}
			return value;
		}
		throw new Error('Internal: Invalid Custom Path Parameter Type ' + group.name);
	}
}

export function processCustomPathParameters(customPathParameters: CustomPathParameters, pathParameters: string, method: MethodMetadata): any {
	const r = customPathParameters.regex.exec(pathParameters) || [];
	let index = 1;
	const result: any = {};
	const route = '/' + customPathParameters.groups.filter((g, index) => r[index + 1]).map(g => `${g.prefix || ''}{${g.name}}`).join('');
	const alias = (method.aliasRoutes || []).find(a => a.route === route);
	for (const group of customPathParameters.groups) {
		if (!alias || !alias.hideParameters.includes(group.name)) {
			result[group.name] = validateCustomPathParameterValue(r[index], group);
		}
		index++;
	}
	return result;
}
