import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseResultType, ObjectTypeOptions } from '../../deco/decorators/ResultType.js';

export function ResultType(): ClassDecorator;
export function ResultType(options: ObjectTypeOptions): ClassDecorator;
export function ResultType(name: string, options?: ObjectTypeOptions): ClassDecorator;
export function ResultType(nameOrOptions?: string | ObjectTypeOptions, maybeOptions?: ObjectTypeOptions): ClassDecorator {
	return BaseResultType(getMetadataStorage(), nameOrOptions, maybeOptions);
}
