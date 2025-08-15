import { ClassMetadata } from '../definitions/class-metadata.js';
import { FieldOptions, TypeOptions, TypeValue } from '../definitions/types.js';
import { ParameterMetadata, RestParameterMetadata, RestParametersMetadata } from '../definitions/parameter-metadata.js';
import { FieldMetadata } from '../definitions/field-metadata.js';
import { EnumMetadata } from '../definitions/enum-metadata.js';
import { getEnumReverseValuesMap } from '../helpers/enums.js';
import { genericError, invalidParameterError, missingParameterError } from './express-error.js';
import { RestContext } from './context.js';
import { getDefaultValue } from '../helpers/default-value.js';
import { UploadFile } from '../definitions/upload-file.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';
import { iterateParameters } from '../helpers/iterate-super.js';

export class ExpressParameters {
	private static validateBoolean(value: unknown, typeOptions: FieldOptions & TypeOptions, parameter: RestParameterMetadata | FieldMetadata): boolean {
		if (typeOptions.array) {
			throw invalidParameterError(parameter.name);
		}
		if (typeof value !== 'boolean') {
			if (value === 'true') {
				return true;
			}
			if (value === 'false') {
				return false;
			}
			throw invalidParameterError(parameter.name);
		}
		return value;
	}

	private static validateNumberPart(value: unknown, typeOptions: FieldOptions & TypeOptions, parameter: RestParameterMetadata | FieldMetadata): number {
		if (value === '') {
			throw invalidParameterError(parameter.name, 'Parameter value is not a number');
		}
		const result = Number(value);
		if (Number.isNaN(result)) {
			throw invalidParameterError(parameter.name, 'Parameter value is not a number');
		}
		if (result % 1 !== 0) {
			throw invalidParameterError(parameter.name, 'Parameter value is not an integer');
		}
		if (typeOptions.min !== undefined && result < typeOptions.min) {
			throw invalidParameterError(parameter.name, 'Parameter value too small');
		}
		if (typeOptions.max !== undefined && result > typeOptions.max) {
			throw invalidParameterError(parameter.name, 'Parameter value too high');
		}
		return result;
	}

	private static validateNumber(value: unknown, typeOptions: FieldOptions & TypeOptions, parameter: RestParameterMetadata | FieldMetadata): number | Array<number> {
		if (typeOptions.array) {
			const array: Array<unknown> = Array.isArray(value) ? value : [value];
			return array.map(v => ExpressParameters.validateNumberPart(v, typeOptions, parameter));
		}
		return ExpressParameters.validateNumberPart(value, typeOptions, parameter);
	}

	private validateString(value: unknown, typeOptions: FieldOptions & TypeOptions, parameter: RestParameterMetadata | FieldMetadata): string | Array<string> | undefined {
		if (typeOptions.array) {
			let array: Array<string> = [];
			if (value && Array.isArray(value)) {
				array = value;
			} else if (value !== undefined && value !== null) {
				// eslint-disable-next-line @typescript-eslint/no-base-to-string
				const s = value.toString();
				if (s.length === 0) {
					throw invalidParameterError(parameter.name);
				}
				array = [s];
			}
			return array.map(String).filter((v: string) => {
				if (v.length === 0 && !typeOptions.nullable) {
					throw invalidParameterError(parameter.name);
				}
				return v.length > 0;
			});
		}
		const result = String(value);
		if (result.length === 0) {
			if (typeOptions.nullable) {
				return;
			}
			throw invalidParameterError(parameter.name);
		}
		return result;
	}

	private validateEnum(value: unknown, typeOptions: FieldOptions & TypeOptions, parameter: RestParameterMetadata | FieldMetadata, enumInfo: EnumMetadata): string | Array<string> {
		const enumObj: any = enumInfo.enumObj;
		const enumValues = getEnumReverseValuesMap(enumObj);
		if (typeOptions.array) {
			const array = Array.isArray(value) ? value : [value];
			const result = array.map(String).filter(s => s.length > 0);
			for (const arrayValue of result) {
				if (!enumValues[arrayValue]) {
					throw invalidParameterError(parameter.name, 'Enum value not valid');
				}
			}
			return result;
		}
		const result = String(value);
		if (!enumValues[result]) {
			throw invalidParameterError(parameter.name, 'Enum value not valid');
		}
		return result;
	}

	private validateObjOrFail(value: unknown, _typeOptions: FieldOptions & TypeOptions, parameter: RestParameterMetadata | FieldMetadata, type: TypeValue, metadata: MetadataStorage): any {
		if (typeof value !== 'object') {
			throw new TypeError(`Internal: Invalid Parameter Object Type for field '${parameter.name}'`);
		}
		const parameterType = metadata.parameterTypes.find(it => it.target === type);
		if (parameterType) {
			const result = new (parameterType.target as new () => Record<string, unknown>)();
			for (const field of parameterType.fields) {
				result[field.name] = this.validateParameterBase(field, value, true, metadata);
			}
			return result;
		}
		if (parameter.typeOptions.generic) {
			return value;
		}
		throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${parameter.name}'`);
	}

	private validateParameterBase(parameter: RestParameterMetadata | FieldMetadata, data: any, isField: boolean, metadata: MetadataStorage): any {
		if (isField) {
			const argumentInstance = new (parameter.target as new () => Record<string, unknown>)();
			parameter.typeOptions.defaultValue = getDefaultValue(
				argumentInstance,
				parameter.typeOptions,
				parameter.name
			);
		}
		let value = data[parameter.name];
		if (value === undefined) {
			value = parameter.typeOptions.defaultValue;
		}
		const typeOptions: FieldOptions & TypeOptions = parameter.typeOptions;
		const isNull = (value === undefined || value === null);
		if (!typeOptions.nullable && isNull) {
			throw missingParameterError(parameter.name);
		}
		if (isNull) {
			return;
		}
		const type = parameter.getType();
		switch (type) {
			case Boolean: {
				value = ExpressParameters.validateBoolean(value, typeOptions, parameter);
				break;
			}
			case Number: {
				value = ExpressParameters.validateNumber(value, typeOptions, parameter);
				break;
			}
			case String: {
				value = this.validateString(value, typeOptions, parameter);
				break;
			}
			default: {
				const enumInfo = metadata.enumInfo(type);
				value = enumInfo ?
					this.validateEnum(value, typeOptions, parameter, enumInfo) :
					this.validateObjOrFail(value, typeOptions, parameter, type, metadata);
			}
		}
		return value;
	}

	private static getData(mode: 'body' | 'query' | 'path' | 'file', context: RestContext<any, any, any>): any {
		switch (mode) {
			case 'body': {
				return context.req.body;
			}
			case 'query': {
				return context.req.query;
			}
			case 'path': {
				return context.req.params;
			}
			case 'file': {
				if (!context.req.file) {
					return {};
				}
				const upload: UploadFile = {
					name: context.req.file.path,
					size: context.req.file.size,
					originalname: context.req.file.originalname,
					type: context.req.file.mimetype
				};
				return upload;
			}
		}
		return {};
	}

	private prepareParameterSingle(parameter: RestParameterMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage): any {
		const result = ExpressParameters.getData(parameter.mode, context);
		if (parameter.mode === 'file') {
			if (!result) {
				throw missingParameterError(parameter.name);
			}
			return result;
		}
		return this.validateParameterBase(parameter, result, false, metadata);
	}

	private mapArgFields(parameterType: ClassMetadata, data: any, parameterMap: Record<string, string>, metadata: MetadataStorage): void {
		for (const field of parameterType.fields) {
			parameterMap[field.name] = this.validateParameterBase(field, data, true, metadata);
		}
	}

	private prepareParameterObj(restParametersMetadata: RestParametersMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage): Record<string, string> {
		const type = restParametersMetadata.getType();
		const parameterType = metadata.parameterTypes.find(it => it.target === type);
		if (!parameterType) {
			throw genericError(
				`The value used as a type of '@QueryParams' for '${restParametersMetadata.propertyName}' of '${restParametersMetadata.target.name}.${
					restParametersMetadata.methodName}' is not a class decorated with '@ObjParamsType' decorator!`
			);
		}
		const parameterMap: Record<string, string> = {};
		const data: any = ExpressParameters.getData(restParametersMetadata.mode, context);
		iterateParameters(metadata.parameterTypes, parameterType, argument => {
			this.mapArgFields(argument, data, parameterMap, metadata);
		});
		return parameterMap;
	}

	validateParameter(parameter: ParameterMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage): any {
		switch (parameter.kind) {
			case 'context': {
				return parameter.propertyName ? (context as any)[parameter.propertyName] : context;
			}
			case 'arg': {
				return this.prepareParameterSingle(parameter, context, metadata);
			}
			case 'args': {
				return this.prepareParameterObj(parameter, context, metadata);
			}
		}
		throw genericError(`Internal: not implemented ${parameter.methodName} ${parameter.kind}`);
	}
}
