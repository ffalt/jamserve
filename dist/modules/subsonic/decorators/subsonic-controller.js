import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseController } from '../../deco/decorators/base-controller.js';
export function SubsonicController(options) {
    return BaseController(metadataStorage(), '', options);
}
//# sourceMappingURL=subsonic-controller.js.map