import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseObjectParametersType } from '../../deco/decorators/base-object-parameters-type.js';

export function SubsonicObjectParametersType(): ClassDecorator {
	return BaseObjectParametersType(metadataStorage());
}
