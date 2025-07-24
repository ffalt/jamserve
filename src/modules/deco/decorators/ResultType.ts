import { getNameDecoratorParams } from '../helpers/decorators.js';
import { DescriptionOptions, AbstractClassOptions, ImplementsClassOptions } from '../definitions/types.js';
import { MetadataStorage } from '../definitions/metadata-storage.js';

export type ObjectTypeOptions = DescriptionOptions & AbstractClassOptions & ImplementsClassOptions;

export function BaseResultType(metadata: MetadataStorage, nameOrOptions?: string | ObjectTypeOptions, maybeOptions?: ObjectTypeOptions): ClassDecorator {
	const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
	// eslint-disable-next-line unicorn/prefer-spread
	const interfaceClasses = options.implements && ([] as Array<Function>).concat(options.implements);
	return target => {
		metadata.resultTypes.push({
			name: name || target.name,
			target,
			fields: [],
			description: options.description,
			interfaceClasses,
			isAbstract: options.isAbstract
		});
	};
}
