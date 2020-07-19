import {Inject} from 'typescript-ioc';
import {ApiBinaryResult, Controller, Get, NotFoundError} from '../../modules/rest';
import {DBObjectType, ImageFormatType, UserRole} from '../../types/enums';
import {ApiImageTypes} from '../../types/consts';
import {ImageArgs} from './image.args';
import {OrmService} from '../../modules/engine/services/orm.service';
import {ImageService} from './image.service';
import {PathParams} from '../../modules/rest/decorators';
import {Base} from '../base/base';
import {BaseRepository} from '../base/base.repository';

@Controller('/image', {tags: ['Image'], roles: [UserRole.stream]})
export class ImageController {
	@Inject
	private imageService!: ImageService;
	@Inject
	private orm!: OrmService;

	public async findInImageTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		const repos: Array<BaseRepository<any, any, any>> = [
			this.orm.Album,
			this.orm.Artist,
			this.orm.Artwork,
			this.orm.Episode,
			this.orm.Folder,
			this.orm.Root,
			this.orm.Playlist,
			this.orm.Podcast,
			this.orm.Radio,
			this.orm.Series,
			this.orm.Track,
			this.orm.User
		]
		for (const repo of repos) {
			const obj = await repo.findOne({id});
			if (obj) {
				return {obj: obj as any, objType: repo.objType};
			}
		}
	}

	@Get(
		'/{id}_{size}.{format}',
		{
			description: 'Image Binary [Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track, User]',
			summary: 'Get Image',
			binary: ApiImageTypes,
			customPathParameters: {
				regex: /(.*?)(_.*?)?(\..*)?$/,
				groups: [
					{name: 'id', getType: () => String},
					{name: 'size', getType: () => Number, prefix: '_', min: 16, max: 1024},
					{name: 'format', getType: () => ImageFormatType, prefix: '.'}
				]
			},
			aliasRoutes: [
				{route: '/{id}_{size}', name: 'by Id and Size', hideParameters: ['format']},
				{route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['size']},
				{route: '/{id}', name: 'by Id', hideParameters: ['size', 'format']}
			]
		}
	)
	async image(@PathParams() imageArgs: ImageArgs): Promise<ApiBinaryResult | undefined> {
		const result = await this.findInImageTypes(imageArgs.id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return await this.imageService.getObjImage(result.obj, result.objType, imageArgs.size, imageArgs.format);
	}

}
