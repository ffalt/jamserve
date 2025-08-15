import { AudioFormatType, UserRole } from '../../types/enums.js';
import { StreamParameters, StreamPathParameters } from './stream.parameters.js';
import { ApiStreamTypes } from '../../types/consts.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { PathParameter } from '../../modules/rest/decorators/path-parameter.js';
import { PathParameters } from '../../modules/rest/decorators/path-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';

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
		@PathParameter('id', { description: 'Media Id', isID: true }) id: string,
		@PathParameters() pathParameters: StreamPathParameters,
		@QueryParameters() streamParameters: StreamParameters,
		@RestContext() { orm, engine }: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInStreamTypes(id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		return engine.stream.streamDBObject(result.obj, result.objType, {
			format: pathParameters.format,
			maxBitRate: pathParameters.maxBitRate,
			timeOffset: streamParameters.timeOffset
		});
	}
}
