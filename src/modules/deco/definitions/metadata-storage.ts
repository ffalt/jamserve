import {MethodMetadata} from './method-metadata.js';
import {ResultClassMetadata} from './object-class-metdata.js';
import {ClassMetadata} from './class-metadata.js';
import {EnumMetadata} from './enum-metadata.js';
import {ControllerClassMetadata} from './controller-metadata.js';
import {FieldMetadata} from './field-metadata.js';
import {ParamMetadata} from './param-metadata.js';
import {ensureReflectMetadataExists} from '../../../utils/reflect.js';

export class MetadataStorage {
	initialized = false;
	all: MethodMetadata[] = [];
	gets: MethodMetadata[] = [];
	posts: MethodMetadata[] = [];
	resultTypes: ResultClassMetadata[] = [];
	inputTypes: ClassMetadata[] = [];
	argumentTypes: ClassMetadata[] = [];
	enums: EnumMetadata[] = [];
	controllerClasses: ControllerClassMetadata[] = [];
	fields: FieldMetadata[] = [];
	params: ParamMetadata[] = [];

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

	private buildClassMetadata(definitions: ClassMetadata[]): void {
		definitions.forEach(def => {
			if (!def.fields || def.fields.length === 0) {
				const fields = this.fields.filter(field => field.target === def.target);
				fields.forEach(field => {
					field.params = this.params.filter(
						param => param.target === field.target && field.name === param.methodName,
					);
				});
				def.fields = fields;
			}
		});
	}

	private buildControllersMetadata(definitions: MethodMetadata[]): void {
		definitions.forEach(def => {
			def.controllerClassMetadata = this.controllerClasses.find(resolver => resolver.target === def.target);
			def.params = this.params.filter(param => param.target === def.target && def.methodName === param.methodName);
		});
	}
}
