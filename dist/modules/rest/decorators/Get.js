import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseGet } from '../../deco/decorators/Get.js';
export function Get(routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions) {
    return BaseGet(getMetadataStorage(), routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=Get.js.map