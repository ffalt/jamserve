import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

export class SubsonicChatApi extends SubsonicApiBase {

	/**
	 * Adds a message to the chat log.
	 * Since 1.2.0
	 * http://your-server/rest/addChatMessage.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async addChatMessage(req: ApiOptions<SubsonicParameters.ChatMessage>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 message 	Yes 		The chat message.
		 */
		await this.engine.chatService.add(req.query.message, req.user);
	}

	/**
	 * Returns the current visible (non-expired) chat messages.
	 * Since 1.2.0
	 * http://your-server/rest/getChatMessages.view
	 * @return  Returns a <subsonic-response> element with a nested <chatMessages> element on success.
	 */
	async getChatMessages(req: ApiOptions<SubsonicParameters.ChatMessages>): Promise<{ chatMessages: Subsonic.ChatMessages }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 since 	No 		Only return messages newer than this time (in millis since Jan 1 1970).
		 */
		const messages = await this.engine.chatService.get(req.query.since);
		return {chatMessages: {chatMessage: messages.map(msg => FORMAT.packChatMessage(msg))}};
	}

}
