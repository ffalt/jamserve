import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseBodyParameter } from '../../deco/decorators/base-body-parameter.js';
export function BodyParameter(name, returnTypeFunctionOrOptions, maybeOptions) {
    return BaseBodyParameter(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=body-parameter.js.map