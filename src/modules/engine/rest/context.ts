import { Orm } from '../services/orm.service.js';
import { User } from '../../../entity/user/user.js';
import { RestContext } from '../../rest/helpers/context.js';
import { EngineService } from '../services/engine.service.js';

export type Context = RestContext<User, Orm, EngineService>;
