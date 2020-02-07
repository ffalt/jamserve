import bodyParser from 'body-parser';
import express from 'express';
// import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as http from 'http';
import path from 'path';
import {Engine} from '../engine/engine';
import {logger} from '../utils/logger';
import {initJamRouter} from './jam/router';
import {JAMAPI_URL_VERSION} from './jam/version';

const log = logger('Server');

export interface EngineRequest extends express.Request {
	engine: Engine;
}

export class Server {
	app: express.Application;
	engine: Engine;
	server: http.Server | undefined;

	constructor(engine: Engine) {
		this.engine = engine;
		const app: express.Application = express();
		app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}));
		app.use(bodyParser.json({limit: '10mb'}));
		app.use(bodyParser.json({type: 'application/vnd.api+json', limit: '10mb'}));

		app.use(helmet());

		if (engine.config.server.session.cookie.proxy) {
			app.enable('trust proxy'); // trust first proxy
		}

		function EngineMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction): void {
			(req as EngineRequest).engine = engine;
			next();
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

		app.use(EngineMiddleWare);
		app.use(`/jam/${JAMAPI_URL_VERSION}`, initJamRouter(engine));

		// frontend (jamberry config file)
		const configFile = path.resolve('./config/jamberry.config.js');
		app.get('/assets/config/config.js', (req, res) => {
			res.sendFile(configFile);
		});
		// frontend (any)
		app.get('/*', express.static(path.resolve(engine.config.paths.frontend)));
		const indexFile = path.resolve(engine.config.paths.frontend, 'index.html');
		app.get('/*', (req: express.Request, res: express.Response) => {
			res.sendFile(indexFile);
		});

		this.app = app;
	}

	getURL(): string {
		return `http://${this.engine.config.server.listen === '127.0.0.1' ? 'localhost' : this.engine.config.server.listen}:${this.engine.config.server.port}`;
	}

	async start(): Promise<void> {
		this.server = this.app.listen(this.engine.config.server.port, this.engine.config.server.listen);
		this.server.setTimeout(4 * 60000); // 4 minutes
		log.info(`listening at ${this.getURL()}`);
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
					// this.server.unref();
				} else {
					resolve();
				}
			}
		);
	}

}
