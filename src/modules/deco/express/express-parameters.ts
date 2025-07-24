import { ClassMetadata } from '../definitions/class-metadata.js';
import { FieldOptions, TypeOptions, TypeValue } from '../definitions/types.js';
import { ParamMetadata, RestParamMetadata, RestParamsMetadata } from '../definitions/param-metadata.js';
import { FieldMetadata } from '../definitions/field-metadata.js';
import { EnumMetadata } from '../definitions/enum-metadata.js';
import { getEnumReverseValuesMap } from '../helpers/enums.js';
import { genericError, invalidParamError, missingParamError } from './express-error.js';
import { RestContext } from './context.js';
import { getDefaultValue } from '../helpers/default-value.js';
import { UploadFile } from '../definitions/upload-file.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';
import { iterateArguments } from '../helpers/iterate-super.js';

export class ExpressParameters {
	private static validateBoolean(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): boolean {
		if (typeOptions.array) {
			throw invalidParamError(param.name);
		}
		if (typeof value !== 'boolean') {
			if (value === 'true') {
				return true;
			} else if (value === 'false') {
				return false;
			} else {
				throw invalidParamError(param.name);
			}
		}
		return value;
	}

	private static validateNumberPart(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): number {
		if (value === '') {
			throw invalidParamError(param.name, `Parameter value is not a number`);
		}
		const val = Number(value);
		if (Number.isNaN(val)) {
			throw invalidParamError(param.name, `Parameter value is not a number`);
		}
		if (val % 1 !== 0) {
			throw invalidParamError(param.name, `Parameter value is not an integer`);
		}
		if (typeOptions.min !== undefined && val < typeOptions.min) {
			throw invalidParamError(param.name, `Parameter value too small`);
		}
		if (typeOptions.max !== undefined && val > typeOptions.max) {
			throw invalidParamError(param.name, `Parameter value too high`);
		}
		return val;
	}

	private static validateNumber(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): number | Array<number> {
		if (typeOptions.array) {
			const array: Array<unknown> = Array.isArray(value) ? value : [value];
			return array.map(v => ExpressParameters.validateNumberPart(v, typeOptions, param));
		}
		return ExpressParameters.validateNumberPart(value, typeOptions, param);
	}

	private validateString(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): string | Array<string> | undefined {
		if (typeOptions.array) {
			let array: Array<string> = [];
			if (value && Array.isArray(value)) {
				array = value;
			} else if (value) {
				// qlty-ignore: radarlint-js:typescript:S6551
				const s = `${value}`;
				if (s.length === 0) {
					throw invalidParamError(param.name);
				}
				array = [s];
			}
			return array.map(String).filter((v: string) => {
				if (v.length === 0 && !typeOptions.nullable) {
					throw invalidParamError(param.name);
				}
				return v.length > 0;
			});
		} else {
			const val = String(value);
			if (val.length === 0) {
				if (typeOptions.nullable) {
					return;
				}
				throw invalidParamError(param.name);
			}
			return val;
		}
	}

	private validateEnum(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata, enumInfo: EnumMetadata): string | Array<string> {
		const enumObj: any = enumInfo.enumObj;
		const enumValues = getEnumReverseValuesMap(enumObj);
		if (typeOptions.array) {
			let array = Array.isArray(value) ? value : [value];
			array = (array || []).map(String).filter(s => s.length > 0);
			for (const val of array) {
				if (!enumValues[val]) {
					throw invalidParamError(param.name, `Enum value not valid`);
				}
			}
			return array;
		} else {
			const val = String(value);
			if (!enumValues[val]) {
				throw invalidParamError(param.name, `Enum value not valid`);
			}
			return val;
		}
	}

	private validateObjOrFail(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata, type: TypeValue, metadata: MetadataStorage): any {
		if (typeof value !== 'object') {
			throw new TypeError(`Internal: Invalid Parameter Object Type for field '${param.name}'`);
		}
		const argumentType = metadata.argumentTypes.find(it => it.target === type);
		if (argumentType) {
			const result = new (argumentType.target as any)();
			for (const field of argumentType.fields) {
				result[field.name] = this.validateParameter(field, value, true, metadata);
			}
			return result;
		}
		if (param.typeOptions.generic) {
			return value;
		}
		throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${param.name}'`);
	}

	private validateParameter(param: RestParamMetadata | FieldMetadata, data: any, isField: boolean, metadata: MetadataStorage): any {
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
			throw missingParamError(param.name);
		}
		if (isNull) {
			return;
		}
		const type = param.getType();
		switch (type) {
			case Boolean: {
				value = ExpressParameters.validateBoolean(value, typeOptions, param);
				break;
			}
			case Number: {
				value = ExpressParameters.validateNumber(value, typeOptions, param);
				break;
			}
			case String: {
				value = this.validateString(value, typeOptions, param);
				break;
			}
			default: {
				const enumInfo = metadata.enums.find(e => e.enumObj === type);
				value = enumInfo ?
					this.validateEnum(value, typeOptions, param, enumInfo) :
					this.validateObjOrFail(value, typeOptions, param, type, metadata);
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

	private prepareParameterSingle(param: RestParamMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage): any {
		const result = ExpressParameters.getData(param.mode, context);
		if (param.mode === 'file') {
			if (!result) {
				throw missingParamError(param.name);
			}
			return result;
		}
		return this.validateParameter(param, result, false, metadata);
	}

	private mapArgFields(argumentType: ClassMetadata, data: any, args: Record<string, string>, metadata: MetadataStorage): void {
		for (const field of argumentType.fields) {
			args[field.name] = this.validateParameter(field, data, true, metadata);
		}
	}

	private prepareParameterObj(param: RestParamsMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage): Record<string, string> {
		const type = param.getType();
		const argumentType = metadata.argumentTypes.find(it => it.target === type);
		if (!argumentType) {
			throw genericError(
				`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
				`is not a class decorated with '@ObjParamsType' decorator!`
			);
		}
		const args: Record<string, string> = {};
		const data: any = ExpressParameters.getData(param.mode, context);
		iterateArguments(metadata.argumentTypes, argumentType, argument => {
			this.mapArgFields(argument, data, args, metadata);
		});
		return args;
	}

	validateArgument(param: ParamMetadata, context: RestContext<any, any, any>, metadata: MetadataStorage): any {
		switch (param.kind) {
			case 'context': {
				return param.propertyName ? (context as any)[param.propertyName] : context;
			}
			case 'arg': {
				return this.prepareParameterSingle(param, context, metadata);
			}
			case 'args': {
				return this.prepareParameterObj(param, context, metadata);
			}
		}
		throw genericError(`Internal: not implemented ${param.methodName} ${param.kind}`);
	}
}
