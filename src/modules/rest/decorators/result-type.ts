import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseResultType, ObjectTypeOptions } from '../../deco/decorators/base-result-type.js';

export function ResultType(): ClassDecorator;
export function ResultType(options: ObjectTypeOptions): ClassDecorator;
export function ResultType(name: string, options?: ObjectTypeOptions): ClassDecorator;
export function ResultType(nameOrOptions?: string | ObjectTypeOptions, maybeOptions?: ObjectTypeOptions): ClassDecorator {
	return BaseResultType(metadataStorage(), nameOrOptions, maybeOptions);
}
