import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseContext } from '../../deco/decorators/base-context.js';
export function RestContext(propertyName) {
    return BaseContext(metadataStorage(), propertyName);
}
//# sourceMappingURL=rest-context.js.map