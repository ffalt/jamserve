import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BasePathParam } from '../../deco/decorators/PathParam.js';
export function PathParam(name, returnTypeFuncOrOptions, maybeOptions) {
    return BasePathParam(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=PathParam.js.map