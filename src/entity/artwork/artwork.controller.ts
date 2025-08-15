import { Artwork, ArtworkPage } from './artwork.model.js';
import { UserRole } from '../../types/enums.js';
import { ArtworkFilterParameters, ArtworkNewParameters, ArtworkNewUploadParameters, ArtworkOrderParameters, ArtworkRenameParameters, IncludesArtworkParameters, IncludesArtworkChildrenParameters } from './artwork.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { IncludesFolderParameters } from '../folder/folder.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { Upload } from '../../modules/rest/decorators/upload.js';
import { UploadFile } from '../../modules/deco/definitions/upload-file.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

@Controller('/artwork', { tags: ['Artwork'], roles: [UserRole.stream] })
export class ArtworkController {
	@Get('/id',
		() => Artwork,
		{ description: 'Get an Artwork by Id', summary: 'Get Artwork' }
	)
	async id(
		@QueryParameter('id', { description: 'Artwork Id', isID: true }) id: string,
		@QueryParameters() artworkParameters: IncludesArtworkParameters,
		@QueryParameters() artworkChildrenParameters: IncludesArtworkChildrenParameters,
		@QueryParameters() folderParameters: IncludesFolderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Artwork> {
		return engine.transform.artwork(
			orm, await orm.Artwork.oneOrFailByID(id),
			artworkParameters, artworkChildrenParameters, folderParameters, user
		);
	}

	@Get(
		'/search',
		() => ArtworkPage,
		{ description: 'Search Artworks' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() artworkParameters: IncludesArtworkParameters,
		@QueryParameters() artworkChildrenParameters: IncludesArtworkChildrenParameters,
		@QueryParameters() folderParameters: IncludesFolderParameters,
		@QueryParameters() filter: ArtworkFilterParameters,
		@QueryParameters() order: ArtworkOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<ArtworkPage> {
		if (list.list) {
			return await orm.Artwork.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.artwork(orm, o, artworkParameters, artworkChildrenParameters, folderParameters, user)
			);
		}
		return await orm.Artwork.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.artwork(orm, o, artworkParameters, artworkChildrenParameters, folderParameters, user)
		);
	}

	@Post(
		'/create',
		() => AdminChangeQueueInfo,
		{ description: 'Create an Artwork', roles: [UserRole.admin], summary: 'Create Artwork' }
	)
	async createByUrl(
		@BodyParameters() parameters: ArtworkNewParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(parameters.folderID);
		return await engine.artwork.createByUrl(folder, parameters.url, parameters.types);
	}

	@Post(
		'/upload',
		() => AdminChangeQueueInfo,
		{ description: 'Upload an Artwork', roles: [UserRole.admin], summary: 'Upload Artwork' }
	)
	async createByUpload(
		@BodyParameters() parameters: ArtworkNewUploadParameters,
		@Upload('image') file: UploadFile,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(parameters.folderID);
		return await engine.artwork.createByFile(folder, file.name, parameters.types);
	}

	@Post(
		'/update',
		() => AdminChangeQueueInfo,
		{ description: 'Update an Artwork', roles: [UserRole.admin], summary: 'Update Artwork' }
	)
	async update(
		@BodyParameter('id', { description: 'Artwork Id', isID: true }) id: string,
		@Upload('image') file: UploadFile,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const artwork = await orm.Artwork.oneOrFailByID(id);
		return await engine.artwork.upload(artwork, file.name);
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{ description: 'Rename an Artwork', roles: [UserRole.admin], summary: 'Rename Artwork' }
	)
	async rename(
		@BodyParameters() parameters: ArtworkRenameParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const artwork = await orm.Artwork.oneOrFailByID(parameters.id);
		return await engine.artwork.rename(artwork, parameters.newName);
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{ description: 'Remove an Artwork', roles: [UserRole.admin], summary: 'Remove Artwork' }
	)
	async remove(
		@BodyParameter('id', { description: 'Artwork Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const artwork = await orm.Artwork.oneOrFailByID(id);
		return await engine.artwork.remove(artwork);
	}
}
