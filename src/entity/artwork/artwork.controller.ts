import {Artwork, ArtworkPage} from './artwork.model.js';
import {UserRole} from '../../types/enums.js';
import {ArtworkFilterArgs, ArtworkNewArgs, ArtworkNewUploadArgs, ArtworkOrderArgs, ArtworkRenameArgs, IncludesArtworkArgs, IncludesArtworkChildrenArgs} from './artwork.args.js';
import {ListArgs, PageArgs} from '../base/base.args.js';
import {AdminChangeQueueInfo} from '../admin/admin.js';
import {IncludesFolderArgs} from '../folder/folder.args.js';
import {Context} from '../../modules/engine/rest/context.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParam} from '../../modules/rest/decorators/QueryParam.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';
import {BodyParams} from '../../modules/rest/decorators/BodyParams.js';
import {Post} from '../../modules/rest/decorators/Post.js';
import {Upload} from '../../modules/rest/decorators/Upload.js';
import {UploadFile} from '../../modules/deco/definitions/upload-file.js';
import {BodyParam} from '../../modules/rest/decorators/BodyParam.js';

@Controller('/artwork', {tags: ['Artwork'], roles: [UserRole.stream]})
export class ArtworkController {
	@Get('/id',
		() => Artwork,
		{description: 'Get an Artwork by Id', summary: 'Get Artwork'}
	)
	async id(
		@QueryParam('id', {description: 'Artwork Id', isID: true}) id: string,
		@QueryParams() artworkArgs: IncludesArtworkArgs,
		@QueryParams() artworkChildrenArgs: IncludesArtworkChildrenArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Artwork> {
		return engine.transform.artwork(
			orm, await orm.Artwork.oneOrFailByID(id),
			artworkArgs, artworkChildrenArgs, folderArgs, user
		);
	}

	@Get(
		'/search',
		() => ArtworkPage,
		{description: 'Search Artworks'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() artworkArgs: IncludesArtworkArgs,
		@QueryParams() artworkChildrenArgs: IncludesArtworkChildrenArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@QueryParams() filter: ArtworkFilterArgs,
		@QueryParams() order: ArtworkOrderArgs,
		@QueryParams() list: ListArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<ArtworkPage> {
		if (list.list) {
			return await orm.Artwork.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.artwork(orm, o, artworkArgs, artworkChildrenArgs, folderArgs, user)
			);
		}
		return await orm.Artwork.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.artwork(orm, o, artworkArgs, artworkChildrenArgs, folderArgs, user)
		);
	}

	@Post(
		'/create',
		() => AdminChangeQueueInfo,
		{description: 'Create an Artwork', roles: [UserRole.admin], summary: 'Create Artwork'}
	)
	async createByUrl(
		@BodyParams() args: ArtworkNewArgs,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(args.folderID);
		return await engine.artwork.createByUrl(folder, args.url, args.types);
	}

	@Post(
		'/upload',
		() => AdminChangeQueueInfo,
		{description: 'Upload an Artwork', roles: [UserRole.admin], summary: 'Upload Artwork'}
	)
	async createByUpload(
		@BodyParams() args: ArtworkNewUploadArgs,
		@Upload('image') file: UploadFile,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(args.folderID);
		return await engine.artwork.createByFile(folder, file.name, args.types);
	}

	@Post(
		'/update',
		() => AdminChangeQueueInfo,
		{description: 'Update an Artwork', roles: [UserRole.admin], summary: 'Update Artwork'}
	)
	async update(
		@BodyParam('id', {description: 'Artwork Id', isID: true}) id: string,
		@Upload('image') file: UploadFile,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const artwork = await orm.Artwork.oneOrFailByID(id);
		return await engine.artwork.upload(artwork, file.name);
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{description: 'Rename an Artwork', roles: [UserRole.admin], summary: 'Rename Artwork'}
	)
	async rename(
		@BodyParams() args: ArtworkRenameArgs,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const artwork = await orm.Artwork.oneOrFailByID(args.id);
		return await engine.artwork.rename(artwork, args.newName);
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{description: 'Remove an Artwork', roles: [UserRole.admin], summary: 'Remove Artwork'}
	)
	async remove(
		@BodyParam('id', {description: 'Artwork Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const artwork = await orm.Artwork.oneOrFailByID(id);
		return await engine.artwork.remove(artwork);
	}

}
