import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseCtx } from '../../deco/decorators/Ctx.js';

export function SubsonicCtx(propertyName?: string): ParameterDecorator {
	return BaseCtx(getMetadataStorage(), propertyName);
}
