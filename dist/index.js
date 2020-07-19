"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const version_1 = require("./version");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
const server_1 = require("./modules/server/server");
dotenv_1.default.config();
logger_1.configureLogger(process.env.JAM_LOG_LEVEL || 'info');
const log = logger_1.logger('Server');
const server = new server_1.Server();
async function run() {
    log.info(`Jamserve ${version_1.JAMSERVE_VERSION} starting`);
    await server.init();
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