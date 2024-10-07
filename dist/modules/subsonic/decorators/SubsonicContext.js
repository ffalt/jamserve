import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseCtx } from '../../deco/decorators/Ctx.js';
export function SubsonicCtx(propertyName) {
    return BaseCtx(getMetadataStorage(), propertyName);
}
//# sourceMappingURL=SubsonicContext.js.map