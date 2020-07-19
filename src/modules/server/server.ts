import {Inject, Singleton} from 'typescript-ioc';
import http from 'http';
import path from 'path';
import express from 'express';
import {EngineService} from '../engine/services/engine.service';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import {useEngineMiddleware} from './middlewares/engine.middleware';
import {ConfigService} from '../engine/services/config.service';
import {logger} from '../../utils/logger';
import {ApolloMiddleware} from './middlewares/apollo.middleware';
import {useSessionMiddleware} from './middlewares/session.middleware';
import {useLogMiddleware} from './middlewares/log.middleware';
import {RestMiddleware} from './middlewares/rest.middleware';
import {usePassPortMiddleWare} from './middlewares/passport.middleware';
import {JAMAPI_URL_VERSION} from '../engine/rest/version';
import {DocsMiddleware} from './middlewares/docs.middleware';
import {useAuthenticatedCors} from './middlewares/cors.middleware';

const log = logger('Server');

@Singleton
export class Server {
	@Inject
	engine!: EngineService;
	@Inject
	apollo!: ApolloMiddleware;
	@Inject
	rest!: RestMiddleware;
	@Inject
	configService!: ConfigService;
	@Inject
	docs!: DocsMiddleware;
	app!: express.Application;
	server: http.Server | undefined;

	async init(): Promise<void> {
		const app: express.Application = express();
		app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
		app.use(bodyParser.json({limit: '10mb'}));
		app.use(bodyParser.json({type: 'application/vnd.api+json', limit: '10mb'}));

		app.use(helmet());

		if (this.configService.env.session.proxy) {
			app.enable('trust proxy'); // trust first proxy
		}
		/*
		TODO: rateLimit limits normal use, since it's counting and blocking 200 requests
		const limiter = rateLimit({
			windowMs: engine.config.server.limit.api.window * 1000,
			max: engine.config.server.limit.api.max,
			skipSuccessfulRequests: true,
			message: 'Too many request fails from this IP, please try again after an hour'
		});
		app.use(limiter);
		 */

		app.use(useLogMiddleware());
		app.use(useEngineMiddleware(this.engine));
		app.use(useSessionMiddleware(this.configService));
		app.use(usePassPortMiddleWare(app, this.engine));
		app.use(useAuthenticatedCors(this.configService));

		app.use(`/jam/${JAMAPI_URL_VERSION}`, this.rest.middleware());
		app.use('/graphql', await this.apollo.middleware());
		app.use('/docs', await this.docs.middleware());

		// frontend (jamberry config file)
		const configFile = path.resolve(this.configService.getDataPath(['config']), 'jamberry.config.js');
		app.get('/assets/config/config.js', (req, res) => {
			res.sendFile(configFile);
		});
		// frontend (any)
		app.get('/*', express.static(path.resolve(this.configService.env.paths.frontend)));
		const indexFile = path.resolve(this.configService.env.paths.frontend, 'index.html');
		app.get('/*', (req: express.Request, res: express.Response) => {
			res.sendFile(indexFile);
		});

		this.app = app;
	}

	getURL(): string {
		return `http://${this.configService.env.host === '127.0.0.1' ? 'localhost' :
			this.configService.env.host}:${this.configService.env.port}`;
	}

	async start(): Promise<void> {
		this.server = this.app.listen(this.configService.env.port, this.configService.env.host);
		this.server.setTimeout(4 * 60000); // 4 minutes
		log.table([
			{Content: 'Frontend', URL: `${this.getURL()}`},
			{Content: 'GraphQl', URL: `${this.getURL()}/graphql`},
			{Content: 'REST Api', URL: `${this.getURL()}/jam/${JAMAPI_URL_VERSION}/ping`},
			{Content: 'REST Documentation', URL: `${this.getURL()}/docs`},
			{Content: 'OpenApi Spec', URL: `${this.getURL()}/docs/openapi.json`},
			{Content: 'GraphQL Spec', URL: `${this.getURL()}/docs/schema.graphql`},
			{Content: 'GraphQL Voyager', URL: `${this.getURL()}/docs/voyager`},
			{Content: 'Angular Client', URL: `${this.getURL()}/docs/angular-client.zip`},
			{Content: 'Axios Client', URL: `${this.getURL()}/docs/axios-client.zip`}
		], [
			{name: 'Content', alignment: 'right'},
			{name: 'URL', alignment: 'left'}
		])
	}

	async stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
				if (this.server) {
					this.server.close(err => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					this.server.unref();
				} else {
					resolve();
				}
			}
		);
	}

}
