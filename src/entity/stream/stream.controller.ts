import {InRequestScope, Inject} from 'typescript-ioc';
import {Controller, Ctx, Get} from '../../modules/rest';
import {AudioFormatType, UserRole} from '../../types/enums';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {NotFoundError} from '../../modules/rest/builder/express-error';
import {PathParam} from '../../modules/rest/decorators/PathParam';
import {PathParams} from '../../modules/rest/decorators/PathParams';
import {StreamArgs} from './stream.args';
import {StreamService} from './stream.service';
import {ApiStreamTypes} from '../../types/consts';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/stream', {tags: ['Stream'], roles: [UserRole.stream]})
export class StreamController {
	@Inject
	private streamService!: StreamService;

	@Get(
		'/{id}_{maxBitRate}.{format}',
		{
			description: 'Stream a media file in a format [Episode, Track]',
			summary: 'Get Stream',
			binary: ApiStreamTypes,
			customPathParameters: {
				regex: /(.*?)(_.*?)?(\..*)?$/,
				groups: [
					{name: 'id', getType: () => String},
					{name: 'maxBitRate', getType: () => Number, prefix: '_', min: 10, max: 480},
					{name: 'format', getType: () => AudioFormatType, prefix: '.'}
				]
			},
			aliasRoutes: [
				{route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['maxBitRate']},
				{route: '/{id}_{maxBitRate}', name: 'by Id and Bitrate', hideParameters: ['format']},
				{route: '/{id}', name: 'by Id', hideParameters: ['format', 'maxBitRate']}
			]
		}
	)
	async stream(
		@PathParam('id', {description: 'Media Id', isID: true}) id: string,
		@PathParams() streamArgs: StreamArgs,
		@Ctx() {orm, user}: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInStreamTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return this.streamService.streamDBObject(result.obj, result.objType, streamArgs.format, streamArgs.maxBitRate, user);
	}

}
