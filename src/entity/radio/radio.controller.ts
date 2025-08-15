import { Radio, RadioIndex, RadioPage } from './radio.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesRadioParameters, RadioFilterParameters, RadioMutateParameters, RadioOrderParameters } from './radio.parameters.js';
import { PageParameters } from '../base/base.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';

@Controller('/radio', { tags: ['Radio'], roles: [UserRole.stream] })
export class RadioController {
	@Get('/id',
		() => Radio,
		{ description: 'Get a Radio by Id', summary: 'Get Radio' }
	)
	async id(
		@QueryParameter('id', { description: 'Radio Id', isID: true }) id: string,
		@QueryParameters() parameters: IncludesRadioParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Radio> {
		return engine.transform.Radio.radio(
			orm, await orm.Radio.oneOrFailByID(id),
			parameters, user
		);
	}

	@Get(
		'/index',
		() => RadioIndex,
		{ description: 'Get the Navigation Index for Radios', summary: 'Get Index' }
	)
	async index(
		@QueryParameters() filter: RadioFilterParameters,
		@RestContext() { orm, engine }: Context
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
		@QueryParameters() page: PageParameters,
		@QueryParameters() parameters: IncludesRadioParameters,
		@QueryParameters() filter: RadioFilterParameters,
		@QueryParameters() order: RadioOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<RadioPage> {
		return await orm.Radio.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.Radio.radio(orm, o, parameters, user)
		);
	}

	@Post(
		'/create',
		{ description: 'Create a Radio', roles: [UserRole.admin], summary: 'Create Radio' }
	)
	async create(
		@BodyParameters() parameters: RadioMutateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Radio> {
		const radio = orm.Radio.create(parameters);
		await orm.Radio.persistAndFlush(radio);
		return await engine.transform.Radio.radio(orm, radio, {}, user);
	}

	@Post(
		'/update',
		{ description: 'Update a Radio', roles: [UserRole.admin], summary: 'Update Radio' }
	)
	async update(
		@BodyParameter('id', { description: 'Root Id', isID: true }) id: string,
		@BodyParameters() parameters: RadioMutateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Radio> {
		const radio = await orm.Radio.oneOrFailByID(id);
		radio.disabled = !!parameters.disabled;
		radio.homepage = parameters.homepage;
		radio.name = parameters.name;
		radio.url = parameters.url;
		await orm.Radio.persistAndFlush(radio);
		return await engine.transform.Radio.radio(orm, radio, {}, user);
	}

	@Post(
		'/remove',
		{ description: 'Remove a Radio', roles: [UserRole.admin], summary: 'Remove Radio' }
	)
	async remove(
		@BodyParameter('id', { description: 'Root Id', isID: true }) id: string,
		@RestContext() { orm }: Context
	): Promise<void> {
		const radio = await orm.Radio.oneOrFailByID(id);
		await orm.Radio.removeAndFlush(radio);
	}
}
