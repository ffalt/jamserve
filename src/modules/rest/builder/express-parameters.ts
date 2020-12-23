import {ClassMetadata} from '../definitions/class-metadata';
import {CustomPathParameterGroup, CustomPathParameters, FieldOptions, TypeOptions, TypeValue} from '../definitions/types';
import {ParamMetadata, RestParamMetadata, RestParamsMetadata} from '../definitions/param-metadata';
import {FieldMetadata} from '../definitions/field-metadata';
import {EnumMetadata} from '../definitions/enum-metadata';
import {getEnumReverseValuesMap} from '../helpers/enums';
import {GenericError, InvalidParamError, MissingParamError} from './express-error';
import {RestContext} from '../helpers/context';
import {getMetadataStorage} from '../metadata';
import {getDefaultValue} from '../helpers/default-value';
import {MethodMetadata} from '../definitions/method-metadata';
import {UploadFile} from '../definitions/upload-file';

function validateBoolean(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): boolean {
	if (typeOptions.array) {
		throw InvalidParamError(param.name);
	}
	if (typeof value !== 'boolean') {
		if (value === 'true') {
			return true;
		} else if (value === 'false') {
			return false;
		} else {
			throw InvalidParamError(param.name);
		}
	}
	return value;
}

function validateNumber(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): number {
	if (typeOptions.array) {
		//TODO: support number arrays
		throw InvalidParamError(param.name);
	}
	if (typeof value === 'string' && value.length === 0) {
		throw InvalidParamError(param.name);
	}
	const val = Number(value);
	if (isNaN(val)) {
		throw InvalidParamError(param.name, `Parameter value is not a number`);
	}
	if (val % 1 !== 0) {
		throw InvalidParamError(param.name, `Parameter value is not an integer`);
	}
	if (typeOptions.min !== undefined && val < typeOptions.min) {
		throw InvalidParamError(param.name, `Parameter value too small`);
	}
	if (typeOptions.max !== undefined && val > typeOptions.max) {
		throw InvalidParamError(param.name, `Parameter value too high`);
	}
	return val;
}

function validateString(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): string | Array<string> {
	if (typeOptions.array) {
		let array: Array<string> = [];
		if (value && Array.isArray(value)) {
			array = value;
		} else if (value) {
			const s = `${value}`;
			if (s.length === 0) {
				throw InvalidParamError(param.name);
			}
			array = [s];
		}
		return array.map((v: any) => String(v)).filter((v: string) => {
			if (v.length === 0 && !typeOptions.nullable) {
				throw InvalidParamError(param.name);
			}
			return v.length > 0;
		});
	} else {
		const val = String(value);
		if (val.length === 0) {
			throw InvalidParamError(param.name);
		}
		return val;
	}
}

function validateEnum(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata, enumInfo: EnumMetadata): string | Array<string> {
	const enumObj: any = enumInfo.enumObj;
	const enumValues = getEnumReverseValuesMap(enumObj);
	if (typeOptions.array) {
		let array = Array.isArray(value) ? value : [value];
		array = (array || []).map((v: any) => String(v)).filter(s => s.length > 0);
		for (const val of array) {
			if (!enumValues[val]) {
				throw InvalidParamError(param.name, `Enum value not valid`);
			}
		}
		return array;
	} else {
		const val = String(value);
		if (!enumValues[val]) {
			throw InvalidParamError(param.name, `Enum value not valid`);
		}
		return val;
	}
}

function validateObjOrFail(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata, type: TypeValue): any {
	if (typeof value !== 'object') {
		throw new Error(`Internal: Invalid Parameter Object Type for field '${param.name}'`);
	}
	const argumentType = getMetadataStorage().argumentTypes.find(it => it.target === type);
	if (argumentType) {
		const result = new (argumentType.target as any)();
		for (const field of argumentType.fields) {
			result[field.name] = validateParameter(field, value, true);
		}
		return result;
	}
	if (param.typeOptions.generic) {
		return value;
	}
	throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${param.name}'`);
}

function validateParameter(param: RestParamMetadata | FieldMetadata, data: any, isField: boolean): any {
	if (isField) {
		const argumentInstance = new (param.target as any)();
		param.typeOptions.defaultValue = getDefaultValue(
			argumentInstance,
			param.typeOptions,
			param.name
		);
	}
	let value = data[param.name];
	if (value === undefined) {
		value = param.typeOptions.defaultValue;
	}
	const typeOptions: FieldOptions & TypeOptions = param.typeOptions;
	const isNull = (value === undefined || value === null);
	if (!typeOptions.nullable && isNull) {
		throw MissingParamError(param.name);
	}
	if (isNull) {
		return;
	}
	const type = param.getType();
	if (type === Boolean) {
		value = validateBoolean(value, typeOptions, param);
	} else if (type === Number) {
		value = validateNumber(value, typeOptions, param);
	} else if (type === String) {
		value = validateString(value, typeOptions, param);
	} else {
		const enumInfo = getMetadataStorage().enums.find(e => e.enumObj === type);
		if (enumInfo) {
			value = validateEnum(value, typeOptions, param, enumInfo);
		} else {
			value = validateObjOrFail(value, typeOptions, param, type);
		}
	}
	return value;
}

function prepareParameterSingle(param: RestParamMetadata, context: RestContext<any, any, any>): any {
	let data: any = {};
	switch (param.mode) {
		case 'body':
			data = context.req.body;
			break;
		case 'query':
			data = context.req.query;
			break;
		case 'path':
			data = context.req.params;
			break;
		case 'file': {
			const upload: UploadFile = {
				name: context.req.file.path,
				size: context.req.file.size,
				originalname: context.req.file.originalname,
				type: context.req.file.mimetype
			};
			return upload;
		}
	}
	return validateParameter(param, data, false);
}

function mapArgFields(argumentType: ClassMetadata, data: any, args: any = {}): void {
	argumentType.fields!.forEach(field => {
		args[field.name] = validateParameter(field, data, true);
	});
}

function prepareParameterObj(param: RestParamsMetadata, context: RestContext<any, any, any>): any {
	const type = param.getType();
	const argumentType = getMetadataStorage().argumentTypes.find(it => it.target === type);
	if (!argumentType) {
		throw GenericError(
			`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
			`is not a class decorated with '@ObjParamsType' decorator!`,
		);
	}
	const args: any = {};
	let data: any = {};
	switch (param.mode) {
		case 'body':
			data = context.req.body;
			break;
		case 'query':
			data = context.req.query;
			break;
		case 'path':
			data = context.req.params;
			break;
	}
	let superClass = Object.getPrototypeOf(argumentType.target);
	while (superClass.prototype !== undefined) {
		const superArgumentType = getMetadataStorage().argumentTypes.find(it => it.target === superClass);
		if (superArgumentType) {
			mapArgFields(superArgumentType, data, args);
		}
		superClass = Object.getPrototypeOf(superClass);
	}
	mapArgFields(argumentType, data, args);
	return args;
}

export function validateArgument(param: ParamMetadata, context: RestContext<any, any, any>): any {
	switch (param.kind) {
		case 'context':
			return param.propertyName ? (context as any)[param.propertyName] : context;
		case 'arg': {
			return prepareParameterSingle(param, context);
		}
		case 'args':
			return prepareParameterObj(param, context);
	}
	throw GenericError(`Internal: not implemented ${param.methodName} ${param.kind}`);
}

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
		const metadata = getMetadataStorage();
		const enumInfo = metadata.enums.find(e => e.enumObj === type);
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
