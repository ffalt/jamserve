import { metadataStorage } from '../metadata/metadata-storage.js';
import { BasePathParameters } from '../../deco/decorators/base-path-parameters.js';
export function PathParameters(parameterTypeFunctionOrOptions, maybeOptions) {
    return BasePathParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=path-parameters.js.map