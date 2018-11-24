import {DBObject} from '../base/base.model';
import {User} from '../user/user.model';

export interface NowPlaying {
	time: number;
	obj: DBObject;
	user: User;
}
