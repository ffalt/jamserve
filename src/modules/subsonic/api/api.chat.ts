import { SubsonicApiBase, SubsonicFormatter } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterChatMessage, SubsonicParameterChatMessages } from '../model/subsonic-rest-params.js';
import { SubsonicResponseChatMessages } from '../model/subsonic-rest-data.js';

export class SubsonicChatApi extends SubsonicApiBase {
	/**
	 * Adds a message to the chat log.
	 * Since 1.2.0
	 * http://your-server/rest/addChatMessage.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('addChatMessage.view', {
		summary: 'Add Chat Messages',
		description: 'Adds a message to the chat log.',
		tags: ['Chat']
	})
	async addChatMessage(@SubsonicParams() query: SubsonicParameterChatMessage, { engine, user }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 message 	Yes 		The chat message.
		 */
		await engine.chat.add(query.message, user);
	}

	/**
	 * Returns the current visible (non-expired) chat messages.
	 * Since 1.2.0
	 * http://your-server/rest/getChatMessages.view
	 * @return  Returns a <subsonic-response> element with a nested <chatMessages> element on success.
	 */
	@SubsonicRoute('getChatMessages.view', () => SubsonicResponseChatMessages, {
		summary: 'Get Chat Messages',
		description: 'Returns the current visible (non-expired) chat messages.',
		tags: ['Chat']
	})
	async getChatMessages(@SubsonicParams() query: SubsonicParameterChatMessages, { engine }: Context): Promise<SubsonicResponseChatMessages> {
		/*
		 Parameter 	Required 	Default 	Comment
		 since 	No 		Only return messages newer than this time (in millis since Jan 1 1970).
		 */
		const messages = await engine.chat.get(query.since);
		return { chatMessages: { chatMessage: messages.map(msg => SubsonicFormatter.packChatMessage(msg)) } };
	}
}
