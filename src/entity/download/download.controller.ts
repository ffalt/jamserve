import {Inject} from 'typescript-ioc';
import {ApiBinaryResult, Controller, CurrentUser, Get, NotFoundError, PathParam, PathParams} from '../../modules/rest';
import {DBObjectType, DownloadFormatType, UserRole} from '../../types/enums';
import {ApiDownloadTypes} from '../../types/consts';
import {OrmService} from '../../modules/engine/services/orm.service';
import {DownloadArgs} from './download.args';
import {Base} from '../base/base';
import {BaseRepository} from '../base/base.repository';
import {DownloadService} from './download.service';
import {User} from '../user/user';

const description = 'Download Archive Binary [Album, Artist, Artwork, Episode, Folder, Playlist, Podcast, Series, Track]';

@Controller('/download', {tags: ['Download'], roles: [UserRole.stream]})
export class DownloadController {
	@Inject
	private orm!: OrmService;
	@Inject
	private downloadService!: DownloadService;

	public async findInDownloadTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		const repos: Array<BaseRepository<any, any, any>> = [
			this.orm.Album,
			this.orm.Artist,
			this.orm.Artwork,
			this.orm.Episode,
			this.orm.Folder,
			this.orm.Playlist,
			this.orm.Podcast,
			this.orm.Series,
			this.orm.Track
		]
		for (const repo of repos) {
			const obj = await repo.findOne({id});
			if (obj) {
				return {obj: obj as any, objType: repo.objType};
			}
		}
	}

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
		@CurrentUser() user: User
	): Promise<ApiBinaryResult | undefined> {
		const result = await this.findInDownloadTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return await this.downloadService.getObjDownload(result.obj, result.objType, downloadArgs.format, user);
	}

}
