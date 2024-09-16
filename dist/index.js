import 'reflect-metadata';
import { JAMSERVE_VERSION } from './version.js';
import dotenv from 'dotenv';
import { configureLogger, logger } from './utils/logger.js';
import { Server } from './modules/server/server.js';
import { Container } from 'typescript-ioc';
dotenv.config();
configureLogger(process.env.JAM_LOG_LEVEL || 'info');
const log = logger('Server');
const server = Container.get(Server);
async function run() {
    log.info(`Jamserve ${JAMSERVE_VERSION} starting`);
    await server.init();
    await server.engine.init();
    await server.engine.start();
    await server.start();
}
async function stop() {
    try {
        await server.stop();
        process.exit();
    }
    catch (e) {
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
//# sourceMappingURL=index.js.map