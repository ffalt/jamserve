import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseQueryParameters } from '../../deco/decorators/base-query-parameters.js';
export function SubsonicParameters(parameterTypeFunctionOrOptions, maybeOptions) {
    return BaseQueryParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=subsonic-parameters.js.map