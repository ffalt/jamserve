import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseBodyParams } from '../../deco/decorators/BodyParams.js';
export function BodyParams(paramTypeFnOrOptions, maybeOptions) {
    return BaseBodyParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions);
}
//# sourceMappingURL=BodyParams.js.map