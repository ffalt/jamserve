import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseController } from '../../deco/decorators/Controller.js';
export function SubsonicController(options) {
    return BaseController(getMetadataStorage(), '', options);
}
//# sourceMappingURL=SubsonicController.js.map