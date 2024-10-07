import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseBodyParam } from '../../deco/decorators/BodyParam.js';
export function BodyParam(name, returnTypeFuncOrOptions, maybeOptions) {
    return BaseBodyParam(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=BodyParam.js.map