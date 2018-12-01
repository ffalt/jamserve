import {DBObject} from '../../objects/base/base.model';
import {User} from '../../objects/user/user.model';

export interface NowPlaying {
	time: number;
	obj: DBObject;
	user: User;
}
