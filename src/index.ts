import 'reflect-metadata';
import { JAMSERVE_VERSION } from './version.js';
import dotenv from 'dotenv';
import { configureLogger, logger } from './utils/logger.js';
import { Server } from './modules/server/server.js';
import { Container } from 'typescript-ioc';

dotenv.config();

configureLogger(process.env.JAM_LOG_LEVEL ?? 'info', process.env.JAM_LOG_FILE);

const log = logger('Server');

const server = Container.get(Server);

async function run(): Promise<void> {
	log.info(`Jamserve ${JAMSERVE_VERSION} starting`);
	await server.engine.init();
	await server.engine.start();
	await server.init();
	await server.start();
}

async function stop(): Promise<void> {
	try {
		await server.stop();
		process.exit();
	} catch (error: unknown) {
		console.error('Error on server stop', error);
		process.exit(1);
	}
}

process.on('SIGTERM', () => {
	stop()
		.catch((error: unknown) => {
			console.error(error);
		});
});

run()
	.catch((error: unknown) => {
		console.error(error);
	});
