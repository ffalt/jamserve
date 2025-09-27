import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseQueryParameter } from '../../deco/decorators/base-query-parameter.js';
export function QueryParameter(name, returnTypeFunctionOrOptions, maybeOptions) {
    return BaseQueryParameter(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=query-parameter.js.map