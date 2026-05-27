import { LandscapeData } from './landscape.model.js';
import { LandscapeParameters } from './landscape.parameters.js';
import { UserRole } from '../../types/enums.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';

@Controller('/landscape', { tags: ['Landscape'], roles: [UserRole.stream] })
export class LandscapeController {
	@Get(
		() => LandscapeData,
		{ description: 'Get Music Collection Landscape Data for visualization', summary: 'Get Landscape' }
	)
	async get(
		@QueryParameters() parameters: LandscapeParameters,
		@RestContext() { orm, engine }: Context
	): Promise<LandscapeData> {
		return engine.landscape.getLandscape(orm, parameters);
	}
}
