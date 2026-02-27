import { Inject, InRequestScope } from 'typescript-ioc';
import http from 'node:http';
import express from 'express';
import { EngineService } from '../engine/services/engine.service.js';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { useEngineMiddleware } from './middlewares/engine.middleware.js';
import { ConfigService } from '../engine/services/config.service.js';
import { logger } from '../../utils/logger.js';
import { useSessionMiddleware } from './middlewares/session.middleware.js';
import { useLogMiddleware } from './middlewares/log.middleware.js';
import { RestMiddleware } from './middlewares/rest.middleware.js';
import { SubsonicMiddleware } from './middlewares/subsonic.middleware.js';
import { usePassPortMiddleWare } from './middlewares/passport.middleware.js';
import { JAMAPI_URL_VERSION } from '../engine/rest/version.js';
import { DocsMiddleware } from './middlewares/docs.middleware.js';
import { useAuthenticatedCors } from './middlewares/cors.middleware.js';
import { SessionService } from '../../entity/session/session.service.js';
import { useCSPMiddleware } from './middlewares/csp.middleware.js';
import { staticMiddleware } from './middlewares/static.middleware.js';
import { GraphqlMiddleware } from './middlewares/graphql.middleware.js';

const log = logger('Server');

@InRequestScope
export class Server {
	@Inject
	engine!: EngineService;

	@Inject
	graphql!: GraphqlMiddleware;

	@Inject
	rest!: RestMiddleware;

	@Inject
	subsonic!: SubsonicMiddleware;

	@Inject
	configService!: ConfigService;

	@Inject
	sessionService!: SessionService;

	@Inject
	docs!: DocsMiddleware;

	app!: express.Application;
	server: http.Server | undefined;

	async init(): Promise<void> {
		const app: express.Application = express();
		log.debug('registering express standard middleware');
		app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
		app.use(bodyParser.json({ limit: '10mb' }));
		app.use(bodyParser.json({ type: 'application/json', limit: '10mb' }));
		app.use(bodyParser.json({ type: 'application/vnd.api+json', limit: '10mb' }));
		app.use(bodyParser.json({ type: 'application/csp-report', limit: '10mb' }));

		app.use(helmet());
		app.use(useCSPMiddleware());
		if (this.configService.env.session.proxy) {
			app.enable('trust proxy'); // trust first proxy
		}

		app.use(useLogMiddleware());

		app.post('/csp/report-violation', async (req, res) => {
			log.error('CSP', req.body ? JSON.stringify(req.body) : 'No data');
			res.status(204).end();
		});

		app.use(useEngineMiddleware(this.engine));

		log.debug('registering subsonic api middleware');
		app.use('/rest', this.subsonic.middleware());

		app.use(useSessionMiddleware(this.configService, this.sessionService));
		app.use(usePassPortMiddleWare(app, this.engine));
		app.use(useAuthenticatedCors(this.configService));

		log.debug('registering jam api middleware');
		app.use(`/jam/${JAMAPI_URL_VERSION}`, this.rest.middleware());

		log.debug('registering graphql middleware');
		app.use('/graphql', await this.graphql.middleware(this.configService));

		log.debug('registering docs middleware');
		app.use('/docs', this.docs.middleware(this.configService));

		log.debug('registering frontend middleware');
		app.use(staticMiddleware(this.configService));

		this.app = app;
	}

	getURL(): string {
		return `http://${
			this.configService.env.host === '127.0.0.1' ? 'localhost' : this.configService.env.host
		}:${this.configService.env.port}`;
	}

	getDomain(): string {
		return this.configService.env.domain || this.getDomain();
	}

	async start(): Promise<void> {
		log.debug(`starting express on ${this.getURL()}`);
		this.server = this.app.listen(this.configService.env.port, this.configService.env.host);
		this.server.setTimeout(4 * 60_000); // 4 minutes
		const domain = this.getDomain();
		log.table([
			{ Content: 'Frontend', URL: domain },
			{ Content: 'GraphQl Api', URL: `${domain}/graphql` },
			{ Content: 'GraphQl Playground', URL: `${domain}/graphql/playground` },
			{ Content: 'REST Api', URL: `${domain}/jam/${JAMAPI_URL_VERSION}/ping` },
			{ Content: 'REST Documentation', URL: `${domain}/docs` },
			{ Content: 'Subsonic REST Api', URL: `${domain}/rest/ping` },
			{ Content: 'Subsonic REST Documentation', URL: `${domain}/docs/subsonic` },
			{ Content: 'OpenApi Spec', URL: `${domain}/docs/openapi.json` },
			{ Content: 'GraphQL Spec', URL: `${domain}/docs/schema.graphql` },
			{ Content: 'Angular Client', URL: `${domain}/docs/angular-client.zip` },
			{ Content: 'Axios Client', URL: `${domain}/docs/axios-client.zip` }
		], [
			{ name: 'Content', alignment: 'right' },
			{ name: 'URL', alignment: 'left' }
		]);
	}

	async stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (this.server) {
				this.server.close(error => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				});
				this.server.unref();
			} else {
				resolve();
			}
		});
	}
}
