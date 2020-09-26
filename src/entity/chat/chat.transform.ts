import {InRequestScope} from 'typescript-ioc';
import {Chat as ORMChat} from './chat';
import {Chat} from './chat.model';

@InRequestScope
export class ChatTransformService {

	chats(chats: Array<ORMChat>): Array<Chat> {
		return chats.map(c => {
			return {...c, created: c.created.valueOf()};
		});
	}
}
