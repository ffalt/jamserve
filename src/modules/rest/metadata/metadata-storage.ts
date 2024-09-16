import {MethodMetadata} from '../definitions/method-metadata.js';
import {ResultClassMetadata} from '../definitions/object-class-metdata.js';
import {ClassMetadata} from '../definitions/class-metadata.js';
import {EnumMetadata} from '../definitions/enum-metadata.js';
import {ControllerClassMetadata} from '../definitions/controller-metadata.js';
import {FieldMetadata} from '../definitions/field-metadata.js';
import {ParamMetadata} from '../definitions/param-metadata.js';
import {TypeValue} from '../definitions/types.js';
import {ensureReflectMetadataExists} from '../../../utils/reflect.js';

export class MetadataStorage {
	initialized = false;
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

	resultType(target: TypeValue): ResultClassMetadata | undefined {
		return this.resultTypes.find(it => it.target === target);
	}

	argumentType(target: TypeValue): ClassMetadata | undefined {
		return this.argumentTypes.find(it => it.target === target);
	}

	collectGetHandlerMetadata(definition: MethodMetadata): void {
		this.gets.push(definition);
	}

	collectPostHandlerMetadata(definition: MethodMetadata): void {
		this.posts.push(definition);
	}

	collectResultMetadata(definition: ResultClassMetadata): void {
		this.resultTypes.push(definition);
	}

	collectArgsMetadata(definition: ClassMetadata): void {
		this.argumentTypes.push(definition);
	}

	collectEnumMetadata(definition: EnumMetadata): void {
		this.enums.push(definition);
	}

	collectControllerClassMetadata(definition: ControllerClassMetadata): void {
		this.controllerClasses.push(definition);
	}

	collectClassFieldMetadata(definition: FieldMetadata): void {
		this.fields.push(definition);
	}

	collectHandlerParamMetadata(definition: ParamMetadata): void {
		this.params.push(definition);
	}

	build(): void {
		if (!this.initialized) {
			this.buildClassMetadata(this.resultTypes);
			this.buildClassMetadata(this.inputTypes);
			this.buildClassMetadata(this.argumentTypes);
			this.buildControllersMetadata(this.gets);
			this.buildControllersMetadata(this.posts);
			this.initialized = true;
		}
	}

	clear(): void {
		this.gets = [];
		this.posts = [];
		this.resultTypes = [];
		this.inputTypes = [];
		this.argumentTypes = [];
		this.enums = [];
		this.controllerClasses = [];
		this.fields = [];
		this.params = [];
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
