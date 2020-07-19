import {Inject, Singleton} from 'typescript-ioc';
import express from 'express';
import {ApolloMiddleware} from './apollo.middleware';
import {RestMiddleware} from './rest.middleware';
import {buildOpenApi} from '../../rest/builder/openapi';
import path from 'path';
import {buildAngularClientZip} from '../../rest/builder/angular';
import {ApiBaseResponder} from '../../rest/builder/express-responder';
import {buildAxiosClientZip} from '../../rest/builder/axios';

@Singleton
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
			res.type( 'application/graphql');
			res.send(this.apollo.printSchema());
		});
		api.get('/openapi.json', (req, res) => {
			res.type( 'application/json');
			res.send(this.getOpenApiSchema(false));
		});
		api.get('/openapi.ext.json', (req, res) => {
			res.type( 'application/json');
			res.send(this.getOpenApiSchema());
		});
		api.get('/angular-client.zip', async (req, res) => {
			const result = await buildAngularClientZip();
			res.type('application/zip');
			ApiBaseResponder.sendBinary(req, res, result);
		});
		api.get('/axios-client.zip', async (req, res) => {
			const result = await buildAxiosClientZip();
			res.type( 'application/zip');
			ApiBaseResponder.sendBinary(req, res, result);
		});
		api.get('/redoc.standalone.min.js', (req, res) => {
			res.type('text/javascript');
			res.sendFile(path.resolve('./static/redoc/redoc.standalone.min.js'));
		});
		api.get('', (req, res) => {
			res.sendFile(path.resolve('./static/redoc/index.html'));
		});
		api.get('/voyager/voyager.min.js', (req, res) => {
			res.type('text/javascript');
			res.sendFile(path.resolve('./static/voyager/voyager.min.js'));
		});
		api.get('/voyager/voyager.worker.js', (req, res) => {
			res.type('text/javascript');
			res.sendFile(path.resolve('./static/voyager/voyager.worker.js'));
		});
		api.get('/voyager/voyager.css', (req, res) => {
			res.type('text/css');
			res.sendFile(path.resolve('./static/voyager/voyager.css'));
		});
		api.get('/voyager/', (req, res) => {
			res.sendFile(path.resolve('./static/voyager/index.html'));
		});
		api.get('', (req, res) => {
			res.sendFile(path.resolve('./static/redoc/index.html'));
		});
		return api;
	}
}
