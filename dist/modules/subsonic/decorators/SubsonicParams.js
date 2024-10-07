import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseQueryParams } from '../../deco/decorators/QueryParams.js';
export function SubsonicParams(paramTypeFnOrOptions, maybeOptions) {
    return BaseQueryParams(getMetadataStorage(), paramTypeFnOrOptions, maybeOptions);
}
//# sourceMappingURL=SubsonicParams.js.map