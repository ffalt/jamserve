import {Orm} from '../../engine/services/orm.service.js';
import {User} from '../../../entity/user/user.js';
import {EngineService} from '../../engine/services/engine.service.js';

export interface Context {
	req: Express.Request;
	res: Express.Response;
	orm: Orm;
	engine: EngineService;
	user: User;
	sessionID: string;
}
