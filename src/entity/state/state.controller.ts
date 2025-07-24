import { UserRole } from '../../types/enums.js';
import { State, States } from './state.model.js';
import { FavArgs, RateArgs, StatesArgs } from './state.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';

const description = '[Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track]';

@Controller('/state', { tags: ['State'], roles: [UserRole.stream] })
export class StateController {
	@Get(
		'/id',
		() => State,
		{ description: `Get User State (fav/rate/etc) ${description}`, summary: 'Get State' }
	)
	async state(
		@QueryParam('id', { description: 'Object Id', isID: true }) id: string,
		@Ctx() { orm, engine, user }: Context
	): Promise<State | undefined> {
		const result = await orm.findInStateTypes(id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		return engine.transform.Base.state(orm, id, result.objType, user.id);
	}

	@Get(
		'/list',
		() => States,
		{ description: `Get User States (fav/rate/etc) ${description}`, summary: 'Get States' }
	)
	async states(
		@QueryParams() args: StatesArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<States> {
		const states: States = { states: [] };
		for (const id of args.ids) {
			const result = await orm.findInStateTypes(id);
			if (result) {
				states.states.push({ id, state: await engine.transform.Base.state(orm, id, result.objType, user.id) });
			}
		}
		return states;
	}

	@Post(
		'/fav',
		() => State,
		{ description: `Set/Unset Favorite ${description}`, summary: 'Fav' }
	)
	async fav(
		@BodyParams() args: FavArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<State> {
		return await engine.transform.Base.stateBase(orm, await engine.state.fav(orm, args.id, args.remove, user));
	}

	@Post(
		'/rate',
		() => State,
		{ description: `Rate ${description}`, summary: 'Rate' }
	)
	async rate(
		@BodyParams() args: RateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<State> {
		return await engine.transform.Base.stateBase(orm, await engine.state.rate(orm, args.id, args.rating, user));
	}
}
