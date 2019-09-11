import {JamRequest} from '../../api/jam/api';
import {NotFoundError, UnauthError} from '../../api/jam/error';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {formatChatMessage} from './chat.format';
import {ChatService} from './chat.service';

export class ChatController {

	constructor(private chatService: ChatService) {
	}

	async list(req: JamRequest<JamParameters.Chat>): Promise<Array<Jam.ChatMessage>> {
		const messages = await this.chatService.get(req.query.since);
		return messages.map(formatChatMessage);
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
