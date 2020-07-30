import {Inject, InRequestScope} from 'typescript-ioc';
import {BodyParams, Controller, Ctx, Get, NotFoundError, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {TransformService} from '../../modules/engine/services/transform.service';
import {State, States} from './state.model';
import {FavArgs, RateArgs, StatesArgs} from './state.args';
import {StateService} from './state.service';
import {Context} from '../../modules/engine/rest/context';

const description = '[Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track]';

@InRequestScope
@Controller('/state', {tags: ['State'], roles: [UserRole.stream]})
export class StateController {
	@Inject
	private stateService!: StateService;
	@Inject
	protected transform!: TransformService;

	@Get(
		'/id',
		() => State,
		{description: `Get User State (fav/rate/etc) ${description}`, summary: 'Get State'}
	)
	async state(
		@QueryParam('id', {description: 'Object Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<State | undefined> {
		const result = await orm.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return this.transform.state(orm, id, result.objType, user.id);
	}

	@Get(
		'/list',
		() => States,
		{description: `Get User States (fav/rate/etc) ${description}`, summary: 'Get States'}
	)
	async states(
		@QueryParams() args: StatesArgs,
		@Ctx() {orm, user}: Context
	): Promise<States> {
		const states: States = {states: []}
		for (const id of args.ids) {
			const result = await orm.findInStateTypes(id);
			if (result) {
				states.states.push({id, state: await this.transform.state(orm, id, result.objType, user.id)})
			}
		}
		return states;
	}

	@Post(
		'/fav',
		() => State,
		{description: `Set/Unset Favorite ${description}`, summary: 'Fav'}
	)
	async fav(
		@BodyParams() args: FavArgs,
		@Ctx() {orm, user}: Context
	): Promise<State> {
		return await this.transform.stateBase(orm, await this.stateService.fav(orm, args.id, args.remove, user));
	}

	@Post(
		'/rate',
		() => State,
		{description: `Rate ${description}`, summary: 'Rate'}
	)
	async rate(
		@BodyParams() args: RateArgs,
		@Ctx() {orm, user}: Context
	): Promise<State> {
		return await this.transform.stateBase(orm, await this.stateService.rate(orm, args.id, args.rating, user));
	}

}
