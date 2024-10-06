import express from 'express';
import { UserRole } from '../../../types/enums.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger.js';
import { RestControllers } from '../../engine/rest/controllers.js';
import { ConfigService } from '../../engine/services/config.service.js';
import { registerRestEnums } from '../../engine/rest/enum-registration.js';
import { buildRestMeta } from '../../rest/metadata/builder.js';
import { RestOptions } from '../../deco/express/express-method.js';
import { restRouter } from '../../rest/builder/express.js';
import { getMetadataStorage } from '../../rest/metadata/getMetadataStorage.js';
import { ApiResponder } from '../../rest/response.js';
import { ApolloMiddleware } from './apollo.middleware.js';

const log = logger('REST');

registerRestEnums();

@InRequestScope
export class GraphqlMiddleware {
	@Inject
	configService!: ConfigService;

	@Inject
	apollo!: ApolloMiddleware;

	async middleware(): Promise<express.Router> {
		const graphql = express.Router();
		log.debug(`registering graphql playground`);
		graphql.use('/playground', await this.apollo.playground());

		log.debug(`registering graphql api middleware`);
		graphql.use('/', await this.apollo.middleware());
		return graphql;
	}
}
