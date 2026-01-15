import { UserRole } from '../../types/enums.js';
import { Chat } from './chat.model.js';
import { ChatCreateParameters, ChatFilterParameters, ChatRemoveParameters } from './chat.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';

@Controller('/chat', { tags: ['Chat'], roles: [UserRole.stream] })
export class ChatController {
	@Get('/list', () => [Chat], { description: 'Get Chat Messages', summary: 'Get Chat' })
	async list(
		@QueryParameters() { since }: ChatFilterParameters,
		@RestContext() { engine }: Context
	): Promise<Array<Chat>> {
		return engine.transform.Chat.chats(await engine.chat.get(since));
	}

	@Post(
		'/create',
		{ description: 'Post a Chat Message', summary: 'Post Chat' }
	)
	async create(
		@BodyParameters() { message }: ChatCreateParameters,
		@RestContext() { engine, user }: Context
	): Promise<void> {
		await engine.chat.add(message, user);
	}

	@Post(
		'/remove',
		{ description: 'Remove a Chat Message', summary: 'Remove Chat' }
	)
	async remove(
		@BodyParameters() { time }: ChatRemoveParameters,
		@RestContext() { engine, user }: Context
	): Promise<void> {
		const chat = await engine.chat.find(time);
		if (chat?.userID === user.id) {
			await engine.chat.remove(chat);
		}
	}
}
