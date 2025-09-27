import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseGet } from '../../deco/decorators/base-get.js';
export function Get(routeOrReturnTypeFunctionOrOptions, returnTypeFunctionOrOptions, maybeOptions) {
    return BaseGet(metadataStorage(), routeOrReturnTypeFunctionOrOptions, returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=get.js.map