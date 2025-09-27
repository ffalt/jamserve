import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseResultType } from '../../deco/decorators/base-result-type.js';
export function SubsonicResultType(nameOrOptions, maybeOptions) {
    return BaseResultType(metadataStorage(), nameOrOptions, maybeOptions);
}
//# sourceMappingURL=subsonic-result-type.js.map