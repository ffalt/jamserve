import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseResultType } from '../../deco/decorators/ResultType.js';
export function SubsonicResultType(nameOrOptions, maybeOptions) {
    return BaseResultType(getMetadataStorage(), nameOrOptions, maybeOptions);
}
//# sourceMappingURL=SubsonicResultType.js.map