import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseQueryParameters } from '../../deco/decorators/base-query-parameters.js';
export function QueryParameters(parameterTypeFunctionOrOptions, maybeOptions) {
    return BaseQueryParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=query-parameters.js.map