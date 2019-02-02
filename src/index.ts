import {Engine} from './engine/engine';
import {configureLogger} from './utils/logger';
import {Server} from './api/server';
import {loadConfig} from './config';
import {Store} from './engine/store/store';
import {DBElastic} from './db/elasticsearch/db-elastic';
import {DBNedb} from './db/nedb/db-nedb';
import {Database} from './db/db.model';
import program from 'commander';

const pack = require('../package.json');
program
	.version(pack.version, '-v, --version')
	.usage('[options]')
	.option('-r, --reset', 'reset the db')
	.option('-c, --config <folder>', 'config file folder')
	.parse(process.argv);

const config = loadConfig(program.config);

configureLogger(config.log.level);

let db: Database;
if (config.database.use === 'elasticsearch') {
	db = new DBElastic(config.database.options.elasticsearch);
} else {
	db = new DBNedb(config.getDataPath(['nedb']));
}
const store = new Store(db);
const engine = new Engine(config, store, pack.version);
const server = new Server(engine);

async function run(): Promise<void> {
	try {
		await engine.start();
		await server.start();
		if (engine.settingsService.settings.library.scanAtStart) {
			engine.ioService.refresh();
		}
	} catch (e) {
		console.error('Error on startup', e);
		return;
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

if (program.reset) {
	runClearDB().then(() => {
		console.log('done.');
	}).catch(e => {
		console.error(e);
	});
} else {

	process.on('SIGTERM', () => {
		stop().catch(e => {
			console.error(e);
		});
	});

	run().catch(e => {
		console.error(e);
	});
}

