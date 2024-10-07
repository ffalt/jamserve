import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseQueryParams } from '../../deco/decorators/QueryParams.js';
export function QueryParams(paramTypeFnOrOptions, maybeOptions) {
    return BaseQueryParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions);
}
//# sourceMappingURL=QueryParams.js.map