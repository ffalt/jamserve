import { DownloadFormatType, UserRole } from '../../types/enums.js';
import { ApiDownloadTypes } from '../../types/consts.js';
import { DownloadParameters } from './download.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { PathParameter } from '../../modules/rest/decorators/path-parameter.js';
import { PathParameters } from '../../modules/rest/decorators/path-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';

const description = 'Download Archive Binary [Album, Artist, Artwork, Episode, Folder, Playlist, Podcast, Series, Track]';

@Controller('/download', { tags: ['Download'], roles: [UserRole.stream] })
export class DownloadController {
	@Get(
		'/{id}.{format}',
		{
			description,
			summary: 'Download',
			binary: ApiDownloadTypes,
			customPathParameters: {
				regex: /(.*?)(\..*)?$/,
				groups: [
					{ name: 'id', getType: () => String },
					{ name: 'format', getType: () => DownloadFormatType, prefix: '.' }
				]
			},
			aliasRoutes: [
				{ route: '/{id}', name: 'by Id', hideParameters: ['format'] }
			]
		}
	)
	async download(
		@PathParameter('id', { description: 'Object Id', isID: true }) id: string,
		@PathParameters() parameters: DownloadParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInDownloadTypes(id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		return await engine.download.getObjDownload(result.obj, result.objType, parameters.format, user);
	}
}
