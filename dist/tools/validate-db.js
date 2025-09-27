import 'reflect-metadata';
import dotenv from 'dotenv';
import { configureLogger, logger } from '../utils/logger.js';
import { OrmService } from '../modules/engine/services/orm.service.js';
import { Container } from 'typescript-ioc';
import 'passport';
import { ConfigService } from '../modules/engine/services/config.service.js';
import { Validator } from '../modules/engine/orm/validator.js';
dotenv.config();
configureLogger('debug');
const log = logger('Tool');
async function validate() {
    const configService = Container.get(ConfigService);
    const ormService = Container.get(OrmService);
    await ormService.init(configService);
    const orm = ormService.fork(true);
    const validator = new Validator();
    await validator.validateORM(orm);
}
validate()
    .then(() => {
    log.info('Done 🍓.');
})
    .catch(console.error);
//# sourceMappingURL=validate-db.js.map