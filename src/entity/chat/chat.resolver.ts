import {Args, Query, Resolver} from 'type-graphql';
import {ChatService} from './chat.service';
import {Chat, ChatQL} from './chat';
import {InRequestScope, Inject} from 'typescript-ioc';
import {ChatFilterArgs} from './chat.args';

@Resolver(ChatQL)
export class ChatResolver {
	@Inject
	private chatService!: ChatService;

	@Query(() => [ChatQL], {description: 'Get Chat Messages'})
	async chats(@Args() {since}: ChatFilterArgs): Promise<Array<Chat>> {
		return this.chatService.get(since)
	}

}
