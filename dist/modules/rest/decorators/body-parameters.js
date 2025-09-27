import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseBodyParameters } from '../../deco/decorators/base-body-parameters.js';
export function BodyParameters(parameterTypeFunctionOrOptions, maybeOptions) {
    return BaseBodyParameters(metadataStorage(), parameterTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=body-parameters.js.map