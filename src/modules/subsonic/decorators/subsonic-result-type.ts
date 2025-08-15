import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseResultType, ObjectTypeOptions } from '../../deco/decorators/base-result-type.js';

export function SubsonicResultType(): ClassDecorator;
export function SubsonicResultType(options: ObjectTypeOptions): ClassDecorator;
export function SubsonicResultType(name: string, options?: ObjectTypeOptions): ClassDecorator;
export function SubsonicResultType(nameOrOptions?: string | ObjectTypeOptions, maybeOptions?: ObjectTypeOptions): ClassDecorator {
	return BaseResultType(metadataStorage(), nameOrOptions, maybeOptions);
}
