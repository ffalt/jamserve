import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
import {NotFoundError, UnauthError} from '../../api/jam/error';
import {JamRequest} from '../../api/jam/api';
import {formatChatMessage} from './chat.format';
import {ChatService} from './chat.service';

export class ChatController {

	constructor(private chatService: ChatService) {
	}

	async list(req: JamRequest<JamParameters.Chat>): Promise<Array<Jam.ChatMessage>> {
		const messages = await this.chatService.get(req.query.since);
		return messages.map(msg => formatChatMessage(msg));
	}

	async create(req: JamRequest<JamParameters.ChatNew>): Promise<void> {
		await this.chatService.add(req.query.message, req.user);
	}

	async delete(req: JamRequest<JamParameters.ChatDelete>): Promise<void> {
		const message = await this.chatService.find(req.query.time);
		if (!message) {
			return Promise.reject(NotFoundError());
		}
		if (message.userID !== req.user.id) {
			return Promise.reject(UnauthError());
		}
		await this.chatService.remove(message);
	}

}
