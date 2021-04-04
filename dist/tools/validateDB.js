"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("../utils/logger");
const orm_service_1 = require("../modules/engine/services/orm.service");
const typescript_ioc_1 = require("typescript-ioc");
const passport_1 = __importDefault(require("passport"));
const config_service_1 = require("../modules/engine/services/config.service");
const validator_1 = require("../modules/engine/orm/validator");
if (!passport_1.default) {
    console.log('Include dummy passport import, so ts-node finds its express types');
}
dotenv_1.default.config();
logger_1.configureLogger('debug');
const log = logger_1.logger('Tool');
async function validate() {
    const configService = typescript_ioc_1.Container.get(config_service_1.ConfigService);
    const ormService = typescript_ioc_1.Container.get(orm_service_1.OrmService);
    await ormService.init(configService);
    const orm = ormService.fork(true);
    const validator = new validator_1.Validator();
    await validator.validateORM(orm);
}
validate()
    .then(() => {
    log.info('Done 🍓.');
})
    .catch(e => {
    console.error(e);
});
//# sourceMappingURL=validateDB.js.map