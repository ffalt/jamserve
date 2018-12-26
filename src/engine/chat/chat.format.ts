import {Jam} from '../../model/jam-rest-data';
import {ChatMessage} from './chat.model';

export function formatChatMessage(message: ChatMessage): Jam.ChatMessage {
	return {
		username: message.username,
		userID: message.userID,
		time: message.time,
		message: message.message
	};
}
