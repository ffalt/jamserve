import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseAll } from '../../deco/decorators/base-all.js';
export function SubsonicRoute(routeOrReturnTypeFunctionOrOptions, returnTypeFunctionOrOptions, maybeOptions) {
    return BaseAll(metadataStorage(), 'xml/json', routeOrReturnTypeFunctionOrOptions, returnTypeFunctionOrOptions, maybeOptions);
}
//# sourceMappingURL=subsonic-route.js.map