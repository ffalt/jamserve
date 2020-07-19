import {Inject} from 'typescript-ioc';
import {BodyParams, Controller, CurrentUser, Get, NotFoundError, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {OrmService} from '../../modules/engine/services/orm.service';
import {User} from '../user/user';
import {TransformService} from '../../modules/engine/services/transform.service';
import {State, States} from './state.model';
import {FavArgs, RateArgs, StatesArgs} from './state.args';
import {StateService} from './state.service';

const description = '[Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track]';

@Controller('/state', {tags: ['State'], roles: [UserRole.stream]})
export class StateController {
	@Inject
	private orm!: OrmService;
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
		@CurrentUser() user: User
	): Promise<State | undefined> {
		const result = await this.stateService.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return this.transform.state(id, result.objType, user.id);
	}

	@Get(
		'/list',
		() => States,
		{description: `Get User States (fav/rate/etc) ${description}`, summary: 'Get States'}
	)
	async states(
		@QueryParams() args: StatesArgs,
		@CurrentUser() user: User
	): Promise<States> {
		const states: States = {states: []}
		for (const id of args.ids) {
			const result = await this.stateService.findInStateTypes(id);
			if (result) {
				states.states.push({id, state: await this.transform.state(id, result.objType, user.id)})
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
		@CurrentUser() user: User
	): Promise<State> {
		return this.stateService.fav(args.id, args.remove, user);
	}

	@Post(
		'/rate',
		() => State,
		{description: `Rate ${description}`, summary: 'Rate'}
	)
	async rate(
		@BodyParams() args: RateArgs,
		@CurrentUser() user: User
	): Promise<State> {
		return this.stateService.rate(args.id, args.rating, user);
	}

}
