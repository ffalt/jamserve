import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseAll } from '../../deco/decorators/All.js';
export function SubsonicRoute(routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions) {
    return BaseAll(getMetadataStorage(), 'xml/json', routeOrReturnTypeFuncOrOptions, returnTypeFuncOrOptions, maybeOptions);
}
//# sourceMappingURL=SubsonicRoute.js.map