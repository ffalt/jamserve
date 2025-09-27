import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseController } from '../../deco/decorators/base-controller.js';
export function Controller(route, options) {
    return BaseController(metadataStorage(), route, options);
}
//# sourceMappingURL=controller.js.map