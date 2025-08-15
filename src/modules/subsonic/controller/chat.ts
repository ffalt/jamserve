import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterChatMessage, SubsonicParameterChatMessages } from '../model/subsonic-rest-parameters.js';
import { SubsonicOKResponse, SubsonicResponseChatMessages } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicFormatter } from '../formatter.js';

@SubsonicController()
export class SubsonicChatApi {
	/**
	 * Adds a message to the chat log.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/addChatMessage', () => SubsonicOKResponse, {
		summary: 'Add Chat Messages',
		description: 'Adds a message to the chat log.',
		tags: ['Chat']
	})
	async addChatMessage(@SubsonicParameters() query: SubsonicParameterChatMessage, @SubsonicContext() { engine, user }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 message 	Yes 		The chat message.
		 */
		await engine.chat.add(query.message, user);
		return {};
	}

	/**
	 * Returns the current visible (non-expired) chat messages.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/getChatMessages', () => SubsonicResponseChatMessages, {
		summary: 'Get Chat Messages',
		description: 'Returns the current visible (non-expired) chat messages.',
		tags: ['Chat']
	})
	async getChatMessages(@SubsonicParameters() query: SubsonicParameterChatMessages, @SubsonicContext() { engine }: Context): Promise<SubsonicResponseChatMessages> {
		/*
		 Parameter 	Required 	Default 	Comment
		 since 	No 		Only return messages newer than this time (in millis since Jan 1 1970).
		 */
		const messages = await engine.chat.get(query.since);
		return { chatMessages: { chatMessage: messages.map(message => SubsonicFormatter.packChatMessage(message)) } };
	}
}
