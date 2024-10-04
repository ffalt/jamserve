import express from 'express';
import { ExpressMethod, RestOptions, RouteInfo } from '../../deco/express/express-method.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';
import { iterateControllers } from '../../deco/helpers/iterate-super.js';

export function subsonicRouter(router: express.Router, metadata: MetadataStorage, options: RestOptions): Array<RouteInfo> {
	const routeInfos: Array<RouteInfo> = [];
	for (const ctrl of metadata.controllerClasses) {
		if (ctrl.abstract) {
			continue;
		}
		let all: Array<MethodMetadata> = [];
		iterateControllers(metadata.controllerClasses, ctrl, ctrlClass => {
			all = all.concat(metadata.all.filter(g => g.controllerClassMetadata === ctrlClass));
		});
		const method = new ExpressMethod();
		for (const request of all) {
			routeInfos.push(method.ALL(request, ctrl, router, options, metadata));
		}
	}
	return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}
