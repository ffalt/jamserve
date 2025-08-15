import { ImageFormatType, UserRole } from '../../types/enums.js';
import { ApiImageTypes } from '../../types/consts.js';
import { ImageParameters } from './image.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { PathParameters } from '../../modules/rest/decorators/path-parameters.js';

@Controller('/image', { tags: ['Image'], roles: [UserRole.stream] })
export class ImageController {
	@Get(
		'/{id}_{size}.{format}',
		{
			description: 'Image Binary [Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track, User]',
			summary: 'Get Image',
			binary: ApiImageTypes,
			customPathParameters: {
				regex: /(.*?)(_.*?)?(\..*)?$/,
				groups: [
					{ name: 'id', getType: () => String },
					{ name: 'size', getType: () => Number, prefix: '_', min: 16, max: 1024 },
					{ name: 'format', getType: () => ImageFormatType, prefix: '.' }
				]
			},
			aliasRoutes: [
				{ route: '/{id}_{size}', name: 'by Id and Size', hideParameters: ['format'] },
				{ route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['size'] },
				{ route: '/{id}', name: 'by Id', hideParameters: ['size', 'format'] }
			]
		}
	)
	async image(
		@PathParameters() parameters: ImageParameters,
		@RestContext() { orm, engine }: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInImageTypes(parameters.id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		return await engine.image.getObjImage(orm, result.obj, result.objType, parameters.size, parameters.format);
	}
}
