import {Engine} from './engine/engine';
import {configureLogger} from './utils/logger';
import {Server} from './api/server';
import {loadConfig} from './config';
import {Store} from './engine/store';

const config = loadConfig();

configureLogger(config.log.level);
const engine = new Engine(config);
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

