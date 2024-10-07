import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseQueryParam } from '../../deco/decorators/QueryParam.js';
export function QueryParam(name, returnTypeFuncOrOptions, maybeOptions) {
    return BaseQueryParam(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=QueryParam.js.map