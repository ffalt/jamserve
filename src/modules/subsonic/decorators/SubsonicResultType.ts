import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {BaseResultType, ObjectTypeOptions} from '../../deco/decorators/ResultType.js';

export function SubsonicResultType(): ClassDecorator;
export function SubsonicResultType(options: ObjectTypeOptions): ClassDecorator;
export function SubsonicResultType(name: string, options?: ObjectTypeOptions): ClassDecorator;
export function SubsonicResultType(nameOrOptions?: string | ObjectTypeOptions, maybeOptions?: ObjectTypeOptions): ClassDecorator {
	return BaseResultType(getMetadataStorage(), nameOrOptions, maybeOptions);
}
