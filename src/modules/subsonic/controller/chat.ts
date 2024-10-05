
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterChatMessage, SubsonicParameterChatMessages } from '../model/subsonic-rest-params.js';
import { SubsonicOKResponse, SubsonicResponseChatMessages } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';

@SubsonicController()
export class SubsonicChatApi {
	/**
	 * Adds a message to the chat log.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/addChatMessage.view', () => SubsonicOKResponse, {
		summary: 'Add Chat Messages',
		description: 'Adds a message to the chat log.',
		tags: ['Chat']
	})
	async addChatMessage(@SubsonicParams() query: SubsonicParameterChatMessage, @SubsonicCtx() { engine, user }: Context): Promise<SubsonicOKResponse> {
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
	@SubsonicRoute('/getChatMessages.view', () => SubsonicResponseChatMessages, {
		summary: 'Get Chat Messages',
		description: 'Returns the current visible (non-expired) chat messages.',
		tags: ['Chat']
	})
	async getChatMessages(@SubsonicParams() query: SubsonicParameterChatMessages,@SubsonicCtx()  { engine }: Context): Promise<SubsonicResponseChatMessages> {
		/*
		 Parameter 	Required 	Default 	Comment
		 since 	No 		Only return messages newer than this time (in millis since Jan 1 1970).
		 */
		const messages = await engine.chat.get(query.since);
		return { chatMessages: { chatMessage: messages.map(msg => SubsonicFormatter.packChatMessage(msg)) } };
	}
}
