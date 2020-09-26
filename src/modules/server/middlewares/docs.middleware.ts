import {Inject, InRequestScope} from 'typescript-ioc';
import express from 'express';
import {ApolloMiddleware} from './apollo.middleware';
import {RestMiddleware} from './rest.middleware';
import {ApiBaseResponder, buildAngularClientZip, buildAxiosClientZip, buildOpenApi} from '../../rest';
import path from 'path';

@InRequestScope
export class DocsMiddleware {
	@Inject
	private apollo!: ApolloMiddleware;
	@Inject
	private rest!: RestMiddleware;

	getOpenApiSchema(extended: boolean = true): string {
		const openapi = buildOpenApi(extended);
		return JSON.stringify(openapi, null, '\t');
	}

	async middleware(): Promise<express.Router> {
		const api = express.Router();
		api.get('/schema.graphql', (req, res) => {
			res.type('application/graphql').send(this.apollo.printSchema());
		});
		api.get('/openapi.json', (req, res) => {
			res.type('application/json').send(this.getOpenApiSchema(false));
		});
		api.get('/openapi.ext.json', (req, res) => {
			res.type('application/json').send(this.getOpenApiSchema());
		});
		api.get('/angular-client.zip', async (req, res) => {
			ApiBaseResponder.sendBinary(req, res, await buildAngularClientZip());
		});
		api.get('/axios-client.zip', async (req, res) => {
			ApiBaseResponder.sendBinary(req, res, await buildAxiosClientZip());
		});
		api.get('/redoc.standalone.min.js', express.static(path.resolve('./static/redoc/redoc.standalone.min.js')));
		api.get('', express.static(path.resolve('./static/redoc/index.html')));
		return api;
	}
}
