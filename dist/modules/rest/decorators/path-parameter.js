import { metadataStorage } from '../metadata/metadata-storage.js';
import { BasePathParameter } from '../../deco/decorators/base-path-parameter.js';
export function PathParameter(name, returnTypeFunctionOrOptions, maybeOptions) {
    return BasePathParameter(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=path-parameter.js.map