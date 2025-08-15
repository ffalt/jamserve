import { metadataStorage } from '../metadata/metadata-storage.js';
import { getNameDecoratorParameters } from '../helpers/decorators.js';
import { EntityTypeOptions } from '../definitions/types.js';

export function Entity(): ClassDecorator;
export function Entity(options: EntityTypeOptions): ClassDecorator;
export function Entity(name: string, options?: EntityTypeOptions): ClassDecorator;
export function Entity(nameOrOptions?: string | EntityTypeOptions, maybeOptions?: EntityTypeOptions): ClassDecorator {
	const { name, options } = getNameDecoratorParameters(nameOrOptions, maybeOptions);
	return target => {
		metadataStorage().entities.push({
			name: name ?? target.name,
			target,
			fields: [],
			isAbstract: options.isAbstract
		});
	};
}
