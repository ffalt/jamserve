import {Ctx, FieldResolver, Int, Query, Resolver} from 'type-graphql';
import {PlayQueue, PlayQueueQL} from './playqueue';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Root as GQLRoot} from 'type-graphql/dist/decorators/Root';
import {PlayQueueEntry, PlayQueueEntryQL} from '../playqueueentry/playqueue-entry';

@Resolver(PlayQueueQL)
export class PlayQueueResolver {
	@Query(() => PlayQueueQL, {description: 'Get a PlayQueue for the calling user'})
	async playQueue(@Ctx() {engine, user}: Context): Promise<PlayQueue> {
		return engine.playQueueService.get(user);
	}

	@FieldResolver(() => [PlayQueueEntryQL])
	async entries(@GQLRoot() playQueue: PlayQueue, @Ctx() {orm}: Context): Promise<Array<PlayQueueEntry>> {
		await orm.PlayQueue.populate(playQueue, 'entries');
		return playQueue.entries.getItems();
	}

	@FieldResolver(() => Int)
	async entriesCount(@GQLRoot() playQueue: PlayQueue, @Ctx() {orm}: Context): Promise<number> {
		await orm.PlayQueue.populate(playQueue, 'entries');
		return playQueue.entries.length;
	}

}
