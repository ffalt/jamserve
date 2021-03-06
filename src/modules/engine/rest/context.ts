import {Orm} from '../services/orm.service';
import {User} from '../../../entity/user/user';
import {RestContext} from '../../rest/helpers/context';
import {EngineService} from '../services/engine.service';

export type Context = RestContext<User, Orm, EngineService>;
