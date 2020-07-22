import {Orm} from '../../engine/services/orm.service';
import {User} from '../../../entity/user/user';
import {EngineService} from '../../engine/services/engine.service';

export interface Context {
	req: Express.Request;
	res: Express.Response;
	orm: Orm;
	engine: EngineService;
	user: User;
	sessionID: string;
}
