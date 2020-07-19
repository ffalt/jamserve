import {Radio, RadioIndex, RadioPage} from './radio.model';
import {User} from '../user/user';
import {BodyParam, BodyParams, Controller, CurrentUser, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {IncludesRadioArgs, RadioFilterArgs, RadioMutateArgs, RadioOrderArgs} from './radio.args';
import {PageArgs} from '../base/base.args';

@Controller('/radio', {tags: ['Radio'], roles: [UserRole.stream]})
export class RadioController extends BaseController {
	@Get('/id',
		() => Radio,
		{description: 'Get a Radio by Id', summary: 'Get Radio'}
	)
	async id(
		@QueryParam('id', {description: 'Radio Id', isID: true}) id: string,
		@QueryParams() radioArgs: IncludesRadioArgs,
		@CurrentUser() user: User
	): Promise<Radio> {
		return this.transform.radio(
			await this.orm.Radio.oneOrFail(id),
			radioArgs, user
		);
	}

	@Get(
		'/index',
		() => RadioIndex,
		{description: 'Get the Navigation Index for Radios', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: RadioFilterArgs): Promise<RadioIndex> {
		const result = await this.orm.Radio.indexFilter(filter);
		return this.transform.radioIndex(result);
	}

	@Get(
		'/search',
		() => RadioPage,
		{description: 'Search Radios'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() radioArgs: IncludesRadioArgs,
		@QueryParams() filter: RadioFilterArgs,
		@QueryParams() order: RadioOrderArgs,
		@CurrentUser() user: User
	): Promise<RadioPage> {
		return await this.orm.Radio.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.radio(o, radioArgs, user)
		);
	}

	@Post(
		'/create',
		{description: 'Create a Radio', roles: [UserRole.admin], summary: 'Create Radio'}
	)
	async create(
		@BodyParams() args: RadioMutateArgs,
		@CurrentUser() user: User
	): Promise<Radio> {
		const radio = this.orm.Radio.create(args);
		await this.orm.orm.em.persistAndFlush(radio);
		return await this.transform.radio(radio, {}, user);
	}

	@Post(
		'/update',
		{description: 'Update a Radio', roles: [UserRole.admin], summary: 'Update Radio'}
	)
	async update(
		@BodyParam('id', {description: 'Root Id', isID: true}) id: string,
		@BodyParams() args: RadioMutateArgs,
		@CurrentUser() user: User
	): Promise<Radio> {
		const radio = await this.orm.Radio.oneOrFail(id);
		radio.disabled = !!args.disabled;
		radio.homepage = args.homepage;
		radio.name = args.name;
		radio.url = args.url;
		await this.orm.orm.em.persistAndFlush(radio);
		return await this.transform.radio(radio, {}, user);
	}

	@Post(
		'/remove',
		{description: 'Remove a Radio', roles: [UserRole.admin], summary: 'Remove Radio'}
	)
	async remove(@BodyParam('id', {description: 'Root Id', isID: true}) id: string): Promise<void> {
		const radio = await this.orm.Radio.oneOrFail(id);
		await this.orm.Radio.removeAndFlush(radio);
	}

}
