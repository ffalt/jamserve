import { MethodMetadata } from './method-metadata.js';
import { ResultClassMetadata } from './object-class-metdata.js';
import { ClassMetadata } from './class-metadata.js';
import { EnumMetadata } from './enum-metadata.js';
import { ControllerClassMetadata } from './controller-metadata.js';
import { FieldMetadata } from './field-metadata.js';
import { ParamMetadata } from './param-metadata.js';
import { ensureReflectMetadataExists } from '../../../utils/reflect.js';

export class MetadataStorage {
	initialized = false;
	all: Array<MethodMetadata> = [];
	gets: Array<MethodMetadata> = [];
	posts: Array<MethodMetadata> = [];
	resultTypes: Array<ResultClassMetadata> = [];
	inputTypes: Array<ClassMetadata> = [];
	argumentTypes: Array<ClassMetadata> = [];
	enums: Array<EnumMetadata> = [];
	controllerClasses: Array<ControllerClassMetadata> = [];
	fields: Array<FieldMetadata> = [];
	params: Array<ParamMetadata> = [];

	constructor() {
		ensureReflectMetadataExists();
	}

	build(): void {
		if (!this.initialized) {
			this.buildClassMetadata(this.resultTypes);
			this.buildClassMetadata(this.inputTypes);
			this.buildClassMetadata(this.argumentTypes);
			this.buildControllersMetadata(this.all);
			this.buildControllersMetadata(this.gets);
			this.buildControllersMetadata(this.posts);
			this.initialized = true;
		}
	}

	private buildClassMetadata(definitions: Array<ClassMetadata>): void {
		for (const def of definitions) {
			if (!def.fields || def.fields.length === 0) {
				const fields = this.fields.filter(field => field.target === def.target);
				for (const field of fields) {
					field.params = this.params.filter(
						param => param.target === field.target && field.name === param.methodName
					);
				}
				def.fields = fields;
			}
		}
	}

	private buildControllersMetadata(definitions: Array<MethodMetadata>): void {
		for (const def of definitions) {
			def.controllerClassMetadata = this.controllerClasses.find(resolver => resolver.target === def.target);
			def.params = this.params.filter(param => param.target === def.target && def.methodName === param.methodName);
		}
	}
}
