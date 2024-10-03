import { Inject, InRequestScope } from 'typescript-ioc';
import express from 'express';
import { ApolloMiddleware } from './apollo.middleware.js';
import path from 'path';
import { buildOpenApi } from '../../rest/builder/openapi.js';
import { buildAngularClientZip } from '../../rest/builder/angular.js';
import { buildAxiosClientZip } from '../../rest/builder/axios.js';
import { ApiResponder } from '../../rest/response.js';
import { buildSubsonicOpenApi } from '../../subsonic/builder/openapi.js';

@InRequestScope
export class DocsMiddleware {
	@Inject private apollo!: ApolloMiddleware;

	getOpenApiSchema(extended: boolean = true): string {
		const openapi = buildOpenApi(extended);
		return JSON.stringify(openapi, null, '\t');
	}

	getSubsonicOpenApiSchema(extended: boolean = true): string {
		const openapi = buildSubsonicOpenApi(extended);
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
		api.get('/subsonic-openapi.json', (req, res) => {
			res.type('application/json').send(this.getSubsonicOpenApiSchema(false));
		});
		api.get('/subsonic-openapi.ext.json', (req, res) => {
			res.type('application/json').send(this.getSubsonicOpenApiSchema());
		});
		api.get('/angular-client.zip', async (req, res) => {
			(new ApiResponder()).sendBinary(req, res, await buildAngularClientZip());
		});
		api.get('/axios-client.zip', async (req, res) => {
			(new ApiResponder()).sendBinary(req, res, await buildAxiosClientZip());
		});
		api.get('/', (_req, res) => {
			res.sendFile(path.resolve('./static/redoc/index.html'));
		});
		api.get('/subsonic/', (_req, res) => {
			res.sendFile(path.resolve('./static/redoc/subsonic.html'));
		});
		api.get('/redoc.standalone.min.js', (_req, res) => {
			res.sendFile(path.resolve('./static/redoc/redoc.standalone.min.js'));
		});
		return api;
	}
}
