import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseCtx } from '../../deco/decorators/Ctx.js';
export function Ctx(propertyName) {
    return BaseCtx(getMetadataStorage(), propertyName);
}
//# sourceMappingURL=Ctx.js.map