import 'reflect-metadata';
import dotenv from 'dotenv';
import { configureLogger, logger } from '../utils/logger';
import { OrmService } from '../modules/engine/services/orm.service';
import { Container } from 'typescript-ioc';
import passport from 'passport';
import { ConfigService } from '../modules/engine/services/config.service';
import { Validator } from '../modules/engine/orm/validator';
if (!passport) {
    console.log('Include dummy passport import, so ts-node finds its express types');
}
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
    .catch(e => {
    console.error(e);
});
//# sourceMappingURL=validateDB.js.map