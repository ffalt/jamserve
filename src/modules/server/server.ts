import {Inject, InRequestScope} from 'typescript-ioc';
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
import {SessionService} from '../../entity/session/session.service';

const log = logger('Server');

@InRequestScope
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
	sessionService!: SessionService;
	@Inject
	docs!: DocsMiddleware;
	app!: express.Application;
	server: http.Server | undefined;

	async init(): Promise<void> {
		const app: express.Application = express();
		log.debug(`registering express standard middleware`);
		app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
		app.use(bodyParser.json({limit: '10mb'}));
		app.use(bodyParser.json({type: 'application/json', limit: '10mb'}));
		app.use(bodyParser.json({type: 'application/vnd.api+json', limit: '10mb'}));
		app.use(bodyParser.json({type: 'application/csp-report', limit: '10mb'}));

		app.use(helmet());
		const self = `'self'`;
		const none = '\'none\'';
		app.use(
			helmet.contentSecurityPolicy({
				directives: {
					defaultSrc: [none],
					scriptSrc: [self],
					mediaSrc: [self, 'data:'],
					frameSrc: [self],
					styleSrc: [self, `https: 'unsafe-inline'`],
					childSrc: [self],
					connectSrc: [self,
						'https://en.wikipedia.org',
						'https://commons.wikimedia.org'
					],
					imgSrc: [
						self,
						'data:',
						'https://gpodder.net',
						'https://coverartarchive.org'
					],
					objectSrc: [none],
					workerSrc: [self],
					fontSrc: [self, 'data:'],
					reportUri: '/csp/report-violation'
				},
			})
		);

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

		app.post('/csp/report-violation', async (req, res) => {
			if (req.body) {
				log.error('CSP', JSON.stringify(req.body));
			} else {
				log.error('CSP', 'No data');
			}

			res.status(204).end();
		});


		app.use(useEngineMiddleware(this.engine));
		app.use(useSessionMiddleware(this.configService, this.sessionService));
		app.use(usePassPortMiddleWare(app, this.engine));
		app.use(useAuthenticatedCors(this.configService));

		log.debug(`registering jam api middleware`);
		app.use(`/jam/${JAMAPI_URL_VERSION}`, this.rest.middleware());

		log.debug(`registering graphql playground`);
		app.use('/graphql/playground', await this.apollo.playground());

		log.debug(`registering graphql middleware`);
		app.use('/graphql', await this.apollo.middleware());

		log.debug(`registering docs middleware`);
		app.use('/docs', await this.docs.middleware());

		log.debug(`registering static middleware`);
		// frontend (jamberry domain config file)
		const jamberry_config = `document.jamberry_config = ${JSON.stringify({name: 'Jam', fixed: {server: this.configService.env.domain}})}`;
		app.get('/assets/config/config.js', (req, res) => {
			res.type('text/javascript');
			res.send(jamberry_config);
		});
		// frontend (any)
		app.get('/*', express.static(path.resolve(this.configService.env.paths.frontend)));
		app.get('/*', express.static(path.resolve(this.configService.env.paths.frontend, 'index.html')));
		this.app = app;
	}

	getURL(): string {
		return `http://${this.configService.env.host === '127.0.0.1' ? 'localhost' :
			this.configService.env.host}:${this.configService.env.port}`;
	}

	getDomain(): string {
		return this.configService.env.domain || this.getDomain();
	}

	async start(): Promise<void> {
		log.debug(`starting express on ${this.getURL()}`);
		this.server = this.app.listen(this.configService.env.port, this.configService.env.host);
		this.server.setTimeout(4 * 60000); // 4 minutes
		const domain = this.getDomain();
		log.table([
			{Content: 'Frontend', URL: `${domain}`},
			{Content: 'GraphQl Api', URL: `${domain}/graphql`},
			{Content: 'GraphQl Playground', URL: `${domain}/graphql/playground`},
			{Content: 'REST Api', URL: `${domain}/jam/${JAMAPI_URL_VERSION}/ping`},
			{Content: 'REST Documentation', URL: `${domain}/docs`},
			{Content: 'OpenApi Spec', URL: `${domain}/docs/openapi.json`},
			{Content: 'GraphQL Spec', URL: `${domain}/docs/schema.graphql`},
			{Content: 'Angular Client', URL: `${domain}/docs/angular-client.zip`},
			{Content: 'Axios Client', URL: `${domain}/docs/axios-client.zip`}
		], [
			{name: 'Content', alignment: 'right'},
			{name: 'URL', alignment: 'left'}
		]);
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
