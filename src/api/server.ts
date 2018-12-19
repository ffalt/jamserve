import express from 'express';
import {Engine} from '../engine/engine';
import bodyParser from 'body-parser';
import {initJamRouter} from './jam/router';
import {initSubsonicRouter} from './subsonic/router';
import path from 'path';
import * as http from 'http';
import Logger from '../utils/logger';
import helmet from 'helmet';

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
		app.use(bodyParser.json({}));
		app.use(bodyParser.json({type: 'application/vnd.api+json'}));

		app.use(helmet());

		function EngineMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction) {
			(<EngineRequest>req).engine = engine;
			next();
		}

		app.use(EngineMiddleWare);
		app.use('/api/v1', initJamRouter(engine));
		app.use('/rest', initSubsonicRouter(engine));

		// jamberry
		app.get('/assets/config/config.js', (req, res) => {
			res.sendFile(path.resolve('./config/jamberry.config.js'));
		});
		app.get('/*', express.static(path.resolve(engine.config.paths.jamberry)));
		app.get('/*', (req: express.Request, res: express.Response) => {
			res.sendFile(path.join(path.resolve(engine.config.paths.jamberry), 'index.html'));
		});

		this.app = app;
	}

	getURL(): string {
		return 'http://' + (this.engine.config.server.listen === '127.0.0.1' ? 'localhost' : this.engine.config.server.listen) + ':' + this.engine.config.server.port;
	}

	async start(): Promise<void> {
		this.server = this.app.listen(this.engine.config.server.port, this.engine.config.server.listen);
		log.info('Listening ' + this.getURL());
	}

	async stop(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
				if (this.server) {
					this.server.close(resolve);
					// this.server.unref();
				} else {
					resolve();
				}
			}
		);
	}

}

