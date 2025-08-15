import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseContext } from '../../deco/decorators/base-context.js';

export function SubsonicContext(propertyName?: string): ParameterDecorator {
	return BaseContext(metadataStorage(), propertyName);
}
