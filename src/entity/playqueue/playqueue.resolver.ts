import {Root as GQLRoot, Ctx, FieldResolver, Int, Query, Resolver} from 'type-graphql';
import {PlayQueue, PlayQueueQL} from './playqueue';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {PlayQueueEntry, PlayQueueEntryQL} from '../playqueueentry/playqueue-entry';

@Resolver(PlayQueueQL)
export class PlayQueueResolver {
	@Query(() => PlayQueueQL, {description: 'Get a PlayQueue for the calling user'})
	async playQueue(@Ctx() {engine, orm, user}: Context): Promise<PlayQueue> {
		return engine.playQueue.get(orm, user);
	}

	@FieldResolver(() => [PlayQueueEntryQL])
	async entries(@GQLRoot() playQueue: PlayQueue): Promise<Array<PlayQueueEntry>> {
		return playQueue.entries.getItems();
	}

	@FieldResolver(() => Int)
	async entriesCount(@GQLRoot() playQueue: PlayQueue): Promise<number> {
		return playQueue.entries.count();
	}

}
