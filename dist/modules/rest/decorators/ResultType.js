import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseResultType } from '../../deco/decorators/ResultType.js';
export function ResultType(nameOrOptions, maybeOptions) {
    return BaseResultType(getMetadataStorage(), nameOrOptions, maybeOptions);
}
//# sourceMappingURL=ResultType.js.map