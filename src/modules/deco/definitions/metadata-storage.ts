import { MethodMetadata } from './method-metadata.js';
import { ResultClassMetadata } from './object-class-metdata.js';
import { ClassMetadata } from './class-metadata.js';
import { EnumMetadata } from './enum-metadata.js';
import { ControllerClassMetadata } from './controller-metadata.js';
import { FieldMetadata } from './field-metadata.js';
import { ParameterMetadata } from './parameter-metadata.js';
import { ensureReflectMetadataExists } from '../../../utils/reflect.js';
import { TypeValue } from './types.js';

export class MetadataStorage {
	initialized = false;
	all: Array<MethodMetadata> = [];
	gets: Array<MethodMetadata> = [];
	posts: Array<MethodMetadata> = [];
	resultTypes: Array<ResultClassMetadata> = [];
	inputTypes: Array<ClassMetadata> = [];
	parameterTypes: Array<ClassMetadata> = [];
	enums: Array<EnumMetadata> = [];
	controllerClasses: Array<ControllerClassMetadata> = [];
	fields: Array<FieldMetadata> = [];
	parameters: Array<ParameterMetadata> = [];

	constructor() {
		ensureReflectMetadataExists();
	}

	build(): void {
		if (!this.initialized) {
			this.buildClassMetadata(this.resultTypes);
			this.buildClassMetadata(this.inputTypes);
			this.buildClassMetadata(this.parameterTypes);
			this.buildControllersMetadata(this.all);
			this.buildControllersMetadata(this.gets);
			this.buildControllersMetadata(this.posts);
			this.initialized = true;
		}
	}

	enumInfo(type: TypeValue): EnumMetadata | undefined {
		return this.enums.find(enumInfo => enumInfo.enumObj === type);
	}

	resultType(type: TypeValue): ResultClassMetadata | undefined {
		return this.resultTypes.find(resultType => resultType.target === type);
	}

	private buildClassMetadata(definitions: Array<ClassMetadata>): void {
		for (const definition of definitions) {
			if (definition.fields.length === 0) {
				const fields = this.fields.filter(field => field.target === definition.target);
				for (const field of fields) {
					field.params = this.parameters.filter(
						parameter => parameter.target === field.target && field.name === parameter.methodName
					);
				}
				definition.fields = fields;
			}
		}
	}

	private buildControllersMetadata(definitions: Array<MethodMetadata>): void {
		for (const definition of definitions) {
			definition.controllerClassMetadata = this.controllerClasses.find(resolver => resolver.target === definition.target);
			definition.parameters = this.parameters.filter(parameter => parameter.target === definition.target && definition.methodName === parameter.methodName);
		}
	}
}
