import {InRequestScope, Inject} from 'typescript-ioc';
import {ApiBinaryResult, Controller, Ctx, Get, NotFoundError, PathParam, PathParams} from '../../modules/rest';
import {DownloadFormatType, UserRole} from '../../types/enums';
import {ApiDownloadTypes} from '../../types/consts';
import {DownloadArgs} from './download.args';
import {DownloadService} from './download.service';
import {Context} from '../../modules/engine/rest/context';

const description = 'Download Archive Binary [Album, Artist, Artwork, Episode, Folder, Playlist, Podcast, Series, Track]';

@InRequestScope
@Controller('/download', {tags: ['Download'], roles: [UserRole.stream]})
export class DownloadController {
	@Inject
	private downloadService!: DownloadService;

	@Get(
		'/{id}.{format}',
		{
			description,
			summary: 'Download',
			binary: ApiDownloadTypes,
			customPathParameters: {
				regex: /(.*?)(\..*)?$/,
				groups: [
					{name: 'id', getType: () => String},
					{name: 'format', getType: () => DownloadFormatType, prefix: '.'}
				]
			},
			aliasRoutes: [
				{route: '/{id}', name: 'by Id', hideParameters: ['format']}
			]
		}
	)
	async download(
		@PathParam('id', {description: 'Object Id', isID: true}) id: string,
		@PathParams() downloadArgs: DownloadArgs,
		@Ctx() {orm, user}: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInDownloadTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return await this.downloadService.getObjDownload(result.obj, result.objType, downloadArgs.format, user);
	}

}
