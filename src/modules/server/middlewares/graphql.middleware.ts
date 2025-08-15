import express from 'express';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger.js';
import { ConfigService } from '../../engine/services/config.service.js';
import { ApolloMiddleware } from './apollo.middleware.js';
import path from 'node:path';
import RateLimit from 'express-rate-limit';

const log = logger('Graphql');

@InRequestScope
export class GraphqlMiddleware {
	@Inject
	readonly configService!: ConfigService;

	@Inject
	readonly apollo!: ApolloMiddleware;

	async playground(): Promise<express.Router> {
		const api = express.Router();
		api.get('{*splat}', express.static(path.resolve('./static/graphql/')));
		return api;
	}

	async middleware(configService: ConfigService): Promise<express.Router> {
		const graphql = express.Router();

		graphql.use(RateLimit(configService.rateLimits.graphlql));

		log.debug('registering graphql playground');
		graphql.use('/playground', await this.playground());

		log.debug('registering graphql api middleware');
		graphql.use('/', await this.apollo.middleware());
		return graphql;
	}
}
