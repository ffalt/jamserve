import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseController } from '../../deco/decorators/Controller.js';
export function Controller(route, options) {
    return BaseController(getMetadataStorage(), route, options);
}
//# sourceMappingURL=Controller.js.map