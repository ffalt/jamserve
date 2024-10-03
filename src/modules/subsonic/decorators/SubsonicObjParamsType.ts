import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseObjParamsType } from '../../deco/decorators/ObjParamsType.js';

export function SubsonicObjParamsType(): ClassDecorator {
	return BaseObjParamsType(getMetadataStorage());
}
