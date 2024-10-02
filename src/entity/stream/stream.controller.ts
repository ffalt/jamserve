import { Controller, Ctx, Get, ApiBinaryResult, NotFoundError, PathParam, PathParams } from '../../modules/rest/index.js';
import { AudioFormatType, UserRole } from '../../types/enums.js';
import { StreamArgs } from './stream.args.js';
import { ApiStreamTypes } from '../../types/consts.js';
import { Context } from '../../modules/engine/rest/context.js';

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
		@PathParams() streamArgs: StreamArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInStreamTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return engine.stream.streamDBObject(result.obj, result.objType, streamArgs.format, streamArgs.maxBitRate, user);
	}
}
