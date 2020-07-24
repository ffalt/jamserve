import 'reflect-metadata';
import {JAMSERVE_VERSION} from './version';
import dotenv from 'dotenv';
import {configureLogger, logger} from './utils/logger';
import {Server} from './modules/server/server';

dotenv.config();

configureLogger(process.env.JAM_LOG_LEVEL || 'info');

const log = logger('Server');

const server = new Server();

async function run(): Promise<void> {
	log.info(`Jamserve ${JAMSERVE_VERSION} starting`);
	await server.init();
	await server.engine.start();
	await server.start();
}

async function stop(): Promise<void> {
	try {
		await server.stop();
		process.exit();
	} catch (e) {
		console.error('Error on server stop', e);
		process.exit(1);
	}
}

process.on('SIGTERM', () => {
	stop().catch(e => {
		console.error(e);
	});
});

run().catch(e => {
	console.error(e);
});