import { ApiBinaryResult, Controller, Ctx, Get, NotFoundError, PathParam, PathParams } from '../../modules/rest/index.js';
import { DownloadFormatType, UserRole } from '../../types/enums.js';
import { ApiDownloadTypes } from '../../types/consts.js';
import { DownloadArgs } from './download.args.js';
import { Context } from '../../modules/engine/rest/context.js';

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
		@PathParam('id', { description: 'Object Id', isID: true }) id: string,
		@PathParams() downloadArgs: DownloadArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInDownloadTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return await engine.download.getObjDownload(result.obj, result.objType, downloadArgs.format, user);
	}
}
