import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BasePathParams } from '../../deco/decorators/PathParams.js';
export function PathParams(paramTypeFnOrOptions, maybeOptions) {
    return BasePathParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions);
}
//# sourceMappingURL=PathParams.js.map