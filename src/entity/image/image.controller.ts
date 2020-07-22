import {ApiBinaryResult, Controller, Ctx, Get, NotFoundError} from '../../modules/rest';
import {ImageFormatType, UserRole} from '../../types/enums';
import {ApiImageTypes} from '../../types/consts';
import {ImageArgs} from './image.args';
import {ImageService} from './image.service';
import {PathParams} from '../../modules/rest/decorators';
import {Context} from '../../modules/engine/rest/context';
import {InRequestScope, Inject} from 'typescript-ioc';

@InRequestScope
@Controller('/image', {tags: ['Image'], roles: [UserRole.stream]})
export class ImageController {
	@Inject
	private imageService!: ImageService;

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
	async image(
		@PathParams() imageArgs: ImageArgs,
		@Ctx() {orm, user}: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInImageTypes(imageArgs.id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return await this.imageService.getObjImage(orm, result.obj, result.objType, imageArgs.size, imageArgs.format);
	}

}
