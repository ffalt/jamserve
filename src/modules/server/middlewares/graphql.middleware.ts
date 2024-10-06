import express from 'express';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger.js';
import { ConfigService } from '../../engine/services/config.service.js';
import { registerRestEnums } from '../../engine/rest/enum-registration.js';
import { ApolloMiddleware } from './apollo.middleware.js';
import path from 'path';
import RateLimit from 'express-rate-limit';

const log = logger('REST');

registerRestEnums();

@InRequestScope
export class GraphqlMiddleware {
	@Inject
	configService!: ConfigService;

	@Inject
	apollo!: ApolloMiddleware;

	async playground(): Promise<express.Router> {
		const api = express.Router();
		api.get('*', express.static(path.resolve('./static/graphql/')));
		return api;
	}

	async middleware(configService: ConfigService): Promise<express.Router> {
		const graphql = express.Router();

		graphql.use(RateLimit(configService.rateLimits.graphlql));

		log.debug(`registering graphql playground`);
		graphql.use('/playground', await this.playground());

		log.debug(`registering graphql api middleware`);
		graphql.use('/', await this.apollo.middleware());
		return graphql;
	}
}