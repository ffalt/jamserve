import { ExpressMethod } from '../../deco/express/express-method.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';
export function subsonicRouter(router, metadata, options) {
    const routeInfos = [];
    for (const ctrl of metadata.controllerClasses) {
        if (ctrl.abstract) {
            continue;
        }
        let all = [];
        iterateControllers(metadata.controllerClasses, ctrl, ctrlClass => {
            all = all.concat(metadata.all.filter(g => g.controllerClassMetadata === ctrlClass));
        });
        const method = new ExpressMethod();
        for (const request of all) {
            routeInfos.push(method.SUBSONIC(request, ctrl, router, options, metadata));
        }
    }
    return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}
//# sourceMappingURL=express.js.map