import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import * as http from 'http';
import path from 'path';
import {Engine} from '../engine/engine';
import Logger from '../utils/logger';
import {initJamRouter} from './jam/router';
import {initSubsonicRouter} from './subsonic/router';

const log = Logger('Server');

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

		app.use(EngineMiddleWare);
		app.use('/api/v1', initJamRouter(engine));
		app.use('/rest', initSubsonicRouter(engine));

		// frontend (jamberry config file)
		app.get('/assets/config/config.js', (req, res) => {
			res.sendFile(path.resolve('./config/jamberry.config.js'));
		});
		// frontend (any)
		app.get('/*', express.static(path.resolve(engine.config.paths.frontend)));
		app.get('/*', (req: express.Request, res: express.Response) => {
			res.sendFile(path.join(path.resolve(engine.config.paths.frontend), 'index.html'));
		});

		this.app = app;
	}

	getURL(): string {
		return 'http://' + (this.engine.config.server.listen === '127.0.0.1' ? 'localhost' : this.engine.config.server.listen) + ':' + this.engine.config.server.port;
	}

	async start(): Promise<void> {
		this.server = this.app.listen(this.engine.config.server.port, this.engine.config.server.listen);
		this.server.setTimeout(4 * 60000); // 4 minutes
		log.info('listening at ' + this.getURL());
	}

	async stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
				if (this.server) {
					this.server.close((err) => {
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
