import { AudioFormatType, UserRole } from '../../types/enums.js';
import { StreamParamArgs, StreamPathArgs } from './stream.args.js';
import { ApiStreamTypes } from '../../types/consts.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { PathParam } from '../../modules/rest/decorators/PathParam.js';
import { PathParams } from '../../modules/rest/decorators/PathParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { NotFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';

@Controller('/stream', { tags: ['Stream'], roles: [UserRole.stream] })
export class StreamController {
	@Get(
		'/{id}_{maxBitRate}.{format}',
		{
			description: 'Stream a media file in a format [Episode, Track]',
			summary: 'Get Stream',
			binary: ApiStreamTypes,
			customPathParameters: {
				regex: /(.*?)(_.*?)?(\..*)?$/,
				groups: [
					{ name: 'id', getType: () => String },
					{ name: 'maxBitRate', getType: () => Number, prefix: '_', min: 10, max: 480 },
					{ name: 'format', getType: () => AudioFormatType, prefix: '.' }
				]
			},
			aliasRoutes: [
				{ route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['maxBitRate'] },
				{ route: '/{id}_{maxBitRate}', name: 'by Id and Bitrate', hideParameters: ['format'] },
				{ route: '/{id}', name: 'by Id', hideParameters: ['format', 'maxBitRate'] }
			]
		}
	)
	async stream(
		@PathParam('id', { description: 'Media Id', isID: true }) id: string,
		@PathParams() streamArgs: StreamPathArgs,
		@QueryParams() streamParamArgs: StreamParamArgs,
		@Ctx() { orm, engine }: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInStreamTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return engine.stream.streamDBObject(result.obj, result.objType, {
			format: streamArgs.format,
			maxBitRate: streamArgs.maxBitRate,
			timeOffset: streamParamArgs.timeOffset
		});
	}
}
