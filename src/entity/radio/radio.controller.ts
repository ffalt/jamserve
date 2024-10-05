import { Radio, RadioIndex, RadioPage } from './radio.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesRadioArgs, RadioFilterArgs, RadioMutateArgs, RadioOrderArgs } from './radio.args.js';
import { PageArgs } from '../base/base.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParam } from '../../modules/rest/decorators/BodyParam.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';

@Controller('/radio', { tags: ['Radio'], roles: [UserRole.stream] })
export class RadioController {
	@Get('/id',
		() => Radio,
		{ description: 'Get a Radio by Id', summary: 'Get Radio' }
	)
	async id(
		@QueryParam('id', { description: 'Radio Id', isID: true }) id: string,
		@QueryParams() radioArgs: IncludesRadioArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Radio> {
		return engine.transform.Radio.radio(
			orm, await orm.Radio.oneOrFailByID(id),
			radioArgs, user
		);
	}

	@Get(
		'/index',
		() => RadioIndex,
		{ description: 'Get the Navigation Index for Radios', summary: 'Get Index' }
	)
	async index(
		@QueryParams() filter: RadioFilterArgs,
		@Ctx() { orm, engine }: Context
	): Promise<RadioIndex> {
		const result = await orm.Radio.indexFilter(filter);
		return engine.transform.Radio.radioIndex(orm, result);
	}

	@Get(
		'/search',
		() => RadioPage,
		{ description: 'Search Radios' }
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() radioArgs: IncludesRadioArgs,
		@QueryParams() filter: RadioFilterArgs,
		@QueryParams() order: RadioOrderArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<RadioPage> {
		return await orm.Radio.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.Radio.radio(orm, o, radioArgs, user)
		);
	}

	@Post(
		'/create',
		{ description: 'Create a Radio', roles: [UserRole.admin], summary: 'Create Radio' }
	)
	async create(
		@BodyParams() args: RadioMutateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Radio> {
		const radio = orm.Radio.create(args);
		await orm.Radio.persistAndFlush(radio);
		return await engine.transform.Radio.radio(orm, radio, {}, user);
	}

	@Post(
		'/update',
		{ description: 'Update a Radio', roles: [UserRole.admin], summary: 'Update Radio' }
	)
	async update(
		@BodyParam('id', { description: 'Root Id', isID: true }) id: string,
		@BodyParams() args: RadioMutateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Radio> {
		const radio = await orm.Radio.oneOrFailByID(id);
		radio.disabled = !!args.disabled;
		radio.homepage = args.homepage;
		radio.name = args.name;
		radio.url = args.url;
		await orm.Radio.persistAndFlush(radio);
		return await engine.transform.Radio.radio(orm, radio, {}, user);
	}

	@Post(
		'/remove',
		{ description: 'Remove a Radio', roles: [UserRole.admin], summary: 'Remove Radio' }
	)
	async remove(
		@BodyParam('id', { description: 'Root Id', isID: true }) id: string,
		@Ctx() { orm }: Context
	): Promise<void> {
		const radio = await orm.Radio.oneOrFailByID(id);
		await orm.Radio.removeAndFlush(radio);
	}
}
