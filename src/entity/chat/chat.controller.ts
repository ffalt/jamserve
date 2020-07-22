import {Inject, InRequestScope} from 'typescript-ioc';
import {TransformService} from '../../modules/engine/services/transform.service';
import {BodyParams, Controller, Ctx, Get, Post, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {Chat} from './chat.model';
import {ChatService} from './chat.service';
import {ChatCreateArgs, ChatFilterArgs, ChatRemoveArgs} from './chat.args';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/chat', {tags: ['Chat'], roles: [UserRole.stream]})
export class ChatController {
	@Inject
	private transform!: TransformService;
	@Inject
	private chatService!: ChatService;

	@Get('/list', () => [Chat], {description: 'Get Chat Messages', summary: 'Get Chat'})
	async list(@QueryParams() {since}: ChatFilterArgs): Promise<Array<Chat>> {
		return this.transform.chats(await this.chatService.get(since));
	}

	@Post(
		'/create',
		{description: 'Post a Chat Message', summary: 'Post Chat'}
	)
	async create(
		@BodyParams() args: ChatCreateArgs,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		await this.chatService.add(args.message, user);
	}

	@Post(
		'/remove',
		{description: 'Remove a Chat Message', summary: 'Remove Chat'}
	)
	async remove(
		@BodyParams() args: ChatRemoveArgs,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		const chat = await this.chatService.find(args.time);
		if (chat && chat.userID === user.id) {
			await this.chatService.remove(chat);
		}
	}
}
