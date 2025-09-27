import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseContext } from '../../deco/decorators/base-context.js';
export function SubsonicContext(propertyName) {
    return BaseContext(metadataStorage(), propertyName);
}
//# sourceMappingURL=subsonic-context.js.map