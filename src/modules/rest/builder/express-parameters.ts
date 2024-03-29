import {ClassMetadata} from '../definitions/class-metadata';
import {FieldOptions, TypeOptions, TypeValue} from '../definitions/types';
import {ParamMetadata, RestParamMetadata, RestParamsMetadata} from '../definitions/param-metadata';
import {FieldMetadata} from '../definitions/field-metadata';
import {EnumMetadata} from '../definitions/enum-metadata';
import {getEnumReverseValuesMap} from '../helpers/enums';
import {GenericError, InvalidParamError, MissingParamError} from './express-error';
import {RestContext} from '../helpers/context';
import {getMetadataStorage} from '../metadata';
import {getDefaultValue} from '../helpers/default-value';
import {UploadFile} from '../definitions/upload-file';
import {MetadataStorage} from '../metadata/metadata-storage';
import {iterateArguments} from '../helpers/iterate-super';

export class ExpressParameters {
	private readonly metadata: MetadataStorage;

	constructor() {
		this.metadata = getMetadataStorage();
	}

	private static validateBoolean(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): boolean {
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

	private static validateNumber(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): number {
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

	private validateString(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata): string | Array<string> | undefined {
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
				if (typeOptions.nullable) {
					return;
				}
				throw InvalidParamError(param.name);
			}
			return val;
		}
	}

	private validateEnum(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata, enumInfo: EnumMetadata): string | Array<string> {
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

	private validateObjOrFail(value: unknown, typeOptions: FieldOptions & TypeOptions, param: RestParamMetadata | FieldMetadata, type: TypeValue): any {
		if (typeof value !== 'object') {
			throw new Error(`Internal: Invalid Parameter Object Type for field '${param.name}'`);
		}
		const argumentType = this.metadata.argumentTypes.find(it => it.target === type);
		if (argumentType) {
			const result = new (argumentType.target as any)();
			for (const field of argumentType.fields) {
				result[field.name] = this.validateParameter(field, value, true);
			}
			return result;
		}
		if (param.typeOptions.generic) {
			return value;
		}
		throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${param.name}'`);
	}

	private validateParameter(param: RestParamMetadata | FieldMetadata, data: any, isField: boolean): any {
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
			value = ExpressParameters.validateBoolean(value, typeOptions, param);
		} else if (type === Number) {
			value = ExpressParameters.validateNumber(value, typeOptions, param);
		} else if (type === String) {
			value = this.validateString(value, typeOptions, param);
		} else {
			const enumInfo = this.metadata.enums.find(e => e.enumObj === type);
			if (enumInfo) {
				value = this.validateEnum(value, typeOptions, param, enumInfo);
			} else {
				value = this.validateObjOrFail(value, typeOptions, param, type);
			}
		}
		return value;
	}

	private static getData(mode: 'body' | 'query' | 'path' | 'file', context: RestContext<any, any, any>): any {
		switch (mode) {
			case 'body':
				return context.req.body;
			case 'query':
				return context.req.query;
			case 'path':
				return context.req.params;
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

	private prepareParameterSingle(param: RestParamMetadata, context: RestContext<any, any, any>): any {
		const result = ExpressParameters.getData(param.mode, context);
		if (param.mode === 'file') {
			if (!result) {
				throw MissingParamError(param.name);
			}
			return result;
		}
		return this.validateParameter(param, result, false);
	}

	private mapArgFields(argumentType: ClassMetadata, data: any, args: any = {}): void {
		argumentType.fields!.forEach(field => {
			args[field.name] = this.validateParameter(field, data, true);
		});
	}

	private prepareParameterObj(param: RestParamsMetadata, context: RestContext<any, any, any>): any {
		const type = param.getType();
		const argumentType = this.metadata.argumentTypes.find(it => it.target === type);
		if (!argumentType) {
			throw GenericError(
				`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
				`is not a class decorated with '@ObjParamsType' decorator!`,
			);
		}
		const args: any = {};
		const data: any = ExpressParameters.getData(param.mode, context);
		iterateArguments(this.metadata, argumentType, argument => {
			this.mapArgFields(argument, data, args);
		});
		return args;
	}

	validateArgument(param: ParamMetadata, context: RestContext<any, any, any>): any {
		switch (param.kind) {
			case 'context':
				return param.propertyName ? (context as any)[param.propertyName] : context;
			case 'arg': {
				return this.prepareParameterSingle(param, context);
			}
			case 'args':
				return this.prepareParameterObj(param, context);
		}
		throw GenericError(`Internal: not implemented ${param.methodName} ${param.kind}`);
	}

}
