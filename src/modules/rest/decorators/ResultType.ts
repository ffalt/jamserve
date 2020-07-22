import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { getNameDecoratorParams } from "../helpers/decorators";
import { DescriptionOptions, AbstractClassOptions, ImplementsClassOptions } from "../definitions/types";

export type ObjectTypeOptions = DescriptionOptions &
	AbstractClassOptions &
	ImplementsClassOptions;

export function ResultType(): ClassDecorator;
export function ResultType(options: ObjectTypeOptions): ClassDecorator;
export function ResultType(name: string, options?: ObjectTypeOptions): ClassDecorator;
export function ResultType(
	nameOrOptions?: string | ObjectTypeOptions,
	maybeOptions?: ObjectTypeOptions,
): ClassDecorator {
	const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
	const interfaceClasses = options.implements && ([] as Function[]).concat(options.implements);

	return target => {
		getMetadataStorage().collectResultMetadata({
			name: name || target.name,
			target,
			fields: [],
			description: options.description,
			interfaceClasses,
			isAbstract: options.isAbstract
		});
	};
}
