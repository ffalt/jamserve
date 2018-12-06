import {Engine} from './engine/engine';
import {configureLogger} from './utils/logger';
import {Server} from './api/server';
import {loadConfig} from './config';
import {Store} from './engine/store/store';
import {DBElastic} from './db/elasticsearch/db-elastic';
import {DBNedb} from './db/nedb/db-nedb';
import {Database} from './db/db.model';

const config = loadConfig();

configureLogger(config.log.level);

let db: Database;
if (config.database.use === 'elasticsearch') {
	db = new DBElastic(config.database.options.elasticsearch);
} else {
	db = new DBNedb(config.getDataPath(['nedb']));
}
const store = new Store(db);
const engine = new Engine(config, store);
const server = new Server(engine);

async function run(): Promise<void> {
	try {
		await engine.start();
		await server.start();
	} catch (e) {
		console.error('Error on startup', e);
		return;
	}
	try {
		await engine.rootService.refresh();
	} catch (e) {
		console.error('Error on startup refresh', e);
	}
}

async function stop(): Promise<void> {
	try {
		await server.stop();
		await engine.stop();
		process.exit();
	} catch (e) {
		console.error('Error on startdown', e);
		process.exit(1);
	}
}

async function runClearDB(): Promise<void> {
	await engine.store.open();
	await engine.store.reset();
	await engine.store.close();
}

if (process.argv.indexOf('--cleardb') > 0) {
	runClearDB().then(() => {
		console.log('done.');
	}).catch(e => {
		console.error(e);
	});
} else {

	process.on('SIGTERM', () => {
		stop();
	});

	run();
}

