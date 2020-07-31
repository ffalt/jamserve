import {Args, Ctx, FieldResolver, Query, Resolver} from 'type-graphql';
import {Chat, ChatQL} from './chat';
import {ChatFilterArgs} from './chat.args';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Root as GQLRoot} from 'type-graphql/dist/decorators/Root';

@Resolver(ChatQL)
export class ChatResolver {
	@Query(() => [ChatQL], {description: 'Get Chat Messages'})
	async chats(@Args() {since}: ChatFilterArgs, @Ctx() {engine}: Context): Promise<Array<Chat>> {
		return engine.chat.get(since);
	}

	@FieldResolver(() => Date)
	created(@GQLRoot() timestamp: number): Date {
		return new Date(timestamp);
	}
}
