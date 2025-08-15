import { UserRole } from '../../types/enums.js';
import { State, States } from './state.model.js';
import { FavParameters, RateParameters, StatesParameters } from './state.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';

const description = '[Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track]';

@Controller('/state', { tags: ['State'], roles: [UserRole.stream] })
export class StateController {
	@Get(
		'/id',
		() => State,
		{ description: `Get User State (fav/rate/etc) ${description}`, summary: 'Get State' }
	)
	async state(
		@QueryParameter('id', { description: 'Object Id', isID: true }) id: string,
		@RestContext() { orm, engine, user }: Context
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
		@QueryParameters() parameters: StatesParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<States> {
		const states: States = { states: [] };
		for (const id of parameters.ids) {
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
		@BodyParameters() parameters: FavParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<State> {
		return await engine.transform.Base.stateBase(orm, await engine.state.fav(orm, parameters.id, parameters.remove, user));
	}

	@Post(
		'/rate',
		() => State,
		{ description: `Rate ${description}`, summary: 'Rate' }
	)
	async rate(
		@BodyParameters() parameters: RateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<State> {
		return await engine.transform.Base.stateBase(orm, await engine.state.rate(orm, parameters.id, parameters.rating, user));
	}
}
