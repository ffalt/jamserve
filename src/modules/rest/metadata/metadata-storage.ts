import {ensureReflectMetadataExists} from 'type-graphql/dist/metadata/utils';
import {MethodMetadata} from '../definitions/method-metadata';
import {ResultClassMetadata} from '../definitions/object-class-metdata';
import {ClassMetadata} from '../definitions/class-metadata';
import {EnumMetadata} from '../definitions/enum-metadata';
import {DirectiveClassMetadata, DirectiveFieldMetadata} from '../definitions/directive-metadata';
import {ControllerClassMetadata, FieldResolverMetadata} from '../definitions/controller-metadata';
import {FieldMetadata} from '../definitions/field-metadata';
import {ParamMetadata} from '../definitions/param-metadata';

export class MetadataStorage {
	gets: MethodMetadata[] = [];
	posts: MethodMetadata[] = [];
	fieldResolvers: FieldResolverMetadata[] = [];
	resultTypes: ResultClassMetadata[] = [];
	inputTypes: ClassMetadata[] = [];
	argumentTypes: ClassMetadata[] = [];
	enums: EnumMetadata[] = [];
	classDirectives: DirectiveClassMetadata[] = [];
	fieldDirectives: DirectiveFieldMetadata[] = [];
	controllerClasses: ControllerClassMetadata[] = [];
	fields: FieldMetadata[] = [];
	params: ParamMetadata[] = [];

	constructor() {
		ensureReflectMetadataExists();
	}

	collectGetHandlerMetadata(definition: MethodMetadata): void {
		this.gets.push(definition);
	}

	collectPostHandlerMetadata(definition: MethodMetadata): void {
		this.posts.push(definition);
	}

	collectFieldResolverMetadata(definition: FieldResolverMetadata): void {
		this.fieldResolvers.push(definition);
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
		this.buildClassMetadata(this.resultTypes);
		this.buildClassMetadata(this.inputTypes);
		this.buildClassMetadata(this.argumentTypes);

		this.buildControllersMetadata(this.gets);
		this.buildControllersMetadata(this.posts);
	}

	clear(): void {
		this.gets = [];
		this.posts = [];
		this.fieldResolvers = [];
		this.resultTypes = [];
		this.inputTypes = [];
		this.argumentTypes = [];
		this.enums = [];
		this.classDirectives = [];
		this.fieldDirectives = [];
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
					field.directives = this.fieldDirectives
						.filter(it => it.target === field.target && it.fieldName === field.name)
						.map(it => it.directive);
				});
				def.fields = fields;
			}
			if (!def.directives) {
				def.directives = this.classDirectives
					.filter(it => it.target === def.target)
					.map(it => it.directive);
			}
		});
	}

	private buildControllersMetadata(definitions: MethodMetadata[]): void {
		definitions.forEach(def => {
			def.controllerClassMetadata = this.controllerClasses.find(resolver => resolver.target === def.target);
			def.params = this.params.filter(param => param.target === def.target && def.methodName === param.methodName);
			def.directives = this.fieldDirectives
				.filter(it => it.target === def.target && it.fieldName === def.methodName)
				.map(it => it.directive);
		});
	}
}
