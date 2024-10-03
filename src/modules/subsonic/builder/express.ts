import express from 'express';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { ExpressMethod, RestOptions, RouteInfo } from '../../deco/express/express-method.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';

export function subsonicRouter(api: express.Router, options: RestOptions): Array<RouteInfo> {
	const routeInfos: Array<RouteInfo> = [];
	const metadata = getMetadataStorage();
	const method = new ExpressMethod();
	const requests: Array<MethodMetadata> = metadata.all;
	for (const request of requests) {
		routeInfos.push(method.ALL(request, undefined, api, options, metadata));
	}
	return routeInfos.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}
