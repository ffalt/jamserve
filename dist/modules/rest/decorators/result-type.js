import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseResultType } from '../../deco/decorators/base-result-type.js';
export function ResultType(nameOrOptions, maybeOptions) {
    return BaseResultType(metadataStorage(), nameOrOptions, maybeOptions);
}
//# sourceMappingURL=result-type.js.map