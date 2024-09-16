import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {getNameDecoratorParams} from '../helpers/decorators.js';
import {EntityTypeOptions} from '../definitions/types.js';

export function Entity(): ClassDecorator;
export function Entity(options: EntityTypeOptions): ClassDecorator;
export function Entity(name: string, options?: EntityTypeOptions): ClassDecorator;
export function Entity(
	nameOrOptions?: string | EntityTypeOptions,
	maybeOptions?: EntityTypeOptions,
): ClassDecorator {
	const {name, options} = getNameDecoratorParams(nameOrOptions, maybeOptions);
	return target => {
		getMetadataStorage().collectEntityMetadata({
			name: name || target.name,
			target,
			fields: [],
			isAbstract: options.isAbstract
		});
	};
}
