import {Radio, RadioIndex, RadioPage} from './radio.model';
import {BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {IncludesRadioArgs, RadioFilterArgs, RadioMutateArgs, RadioOrderArgs} from './radio.args';
import {PageArgs} from '../base/base.args';
import {Context} from '../../modules/engine/rest/context';
import {InRequestScope} from 'typescript-ioc';

@InRequestScope
@Controller('/radio', {tags: ['Radio'], roles: [UserRole.stream]})
export class RadioController extends BaseController {
	@Get('/id',
		() => Radio,
		{description: 'Get a Radio by Id', summary: 'Get Radio'}
	)
	async id(
		@QueryParam('id', {description: 'Radio Id', isID: true}) id: string,
		@QueryParams() radioArgs: IncludesRadioArgs,
		@Ctx() {orm, user}: Context
	): Promise<Radio> {
		return this.transform.radio(
			orm, await orm.Radio.oneOrFailByID(id),
			radioArgs, user
		);
	}

	@Get(
		'/index',
		() => RadioIndex,
		{description: 'Get the Navigation Index for Radios', summary: 'Get Index'}
	)
	async index(
		@QueryParams() filter: RadioFilterArgs,
		@Ctx() {orm}: Context
	): Promise<RadioIndex> {
		const result = await orm.Radio.indexFilter(filter);
		return this.transform.radioIndex(orm, result);
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
		@Ctx() {orm, user}: Context
	): Promise<RadioPage> {
		return await orm.Radio.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.radio(orm, o, radioArgs, user)
		);
	}

	@Post(
		'/create',
		{description: 'Create a Radio', roles: [UserRole.admin], summary: 'Create Radio'}
	)
	async create(
		@BodyParams() args: RadioMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<Radio> {
		const radio = orm.Radio.create(args);
		await orm.Radio.persistAndFlush(radio);
		return await this.transform.radio(orm, radio, {}, user);
	}

	@Post(
		'/update',
		{description: 'Update a Radio', roles: [UserRole.admin], summary: 'Update Radio'}
	)
	async update(
		@BodyParam('id', {description: 'Root Id', isID: true}) id: string,
		@BodyParams() args: RadioMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<Radio> {
		const radio = await orm.Radio.oneOrFailByID(id);
		radio.disabled = !!args.disabled;
		radio.homepage = args.homepage;
		radio.name = args.name;
		radio.url = args.url;
		await orm.Radio.persistAndFlush(radio);
		return await this.transform.radio(orm, radio, {}, user);
	}

	@Post(
		'/remove',
		{description: 'Remove a Radio', roles: [UserRole.admin], summary: 'Remove Radio'}
	)
	async remove(
		@BodyParam('id', {description: 'Root Id', isID: true}) id: string,
		@Ctx() {orm}: Context
	): Promise<void> {
		const radio = await orm.Radio.oneOrFailByID(id);
		await orm.Radio.removeAndFlush(radio);
	}

}
