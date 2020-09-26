import {BodyParams, Controller, Ctx, Get, Post, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {Chat} from './chat.model';
import {ChatCreateArgs, ChatFilterArgs, ChatRemoveArgs} from './chat.args';
import {Context} from '../../modules/engine/rest/context';
@Controller('/chat', {tags: ['Chat'], roles: [UserRole.stream]})
export class ChatController {
	@Get('/list', () => [Chat], {description: 'Get Chat Messages', summary: 'Get Chat'})
	async list(
		@QueryParams() {since}: ChatFilterArgs,
		@Ctx() {engine}: Context
	): Promise<Array<Chat>> {
		return engine.transform.Chat.chats(await engine.chat.get(since));
	}

	@Post(
		'/create',
		{description: 'Post a Chat Message', summary: 'Post Chat'}
	)
	async create(
		@BodyParams() args: ChatCreateArgs,
		@Ctx() {engine, user}: Context
	): Promise<void> {
		await engine.chat.add(args.message, user);
	}

	@Post(
		'/remove',
		{description: 'Remove a Chat Message', summary: 'Remove Chat'}
	)
	async remove(
		@BodyParams() args: ChatRemoveArgs,
		@Ctx() {engine, user}: Context
	): Promise<void> {
		const chat = await engine.chat.find(args.time);
		if (chat && chat.userID === user.id) {
			await engine.chat.remove(chat);
		}
	}
}
