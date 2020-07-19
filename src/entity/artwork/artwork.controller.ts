import {Artwork, ArtworkPage} from './artwork.model';
import {User} from '../user/user';
import {BodyParam, BodyParams, Controller, CurrentUser, Get, Post, QueryParam, QueryParams, Upload, UploadFile} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {ArtworkFilterArgs, ArtworkNewArgs, ArtworkNewUploadArgs, ArtworkOrderArgs, ArtworkRenameArgs, IncludesArtworkArgs, IncludesArtworkChildrenArgs} from './artwork.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {Inject} from 'typescript-ioc';
import {ArtworkService} from './artwork.service';
import {AdminChangeQueueInfo} from '../admin/admin';
import {IncludesFolderArgs} from '../folder/folder.args';

@Controller('/artwork', {tags: ['Artwork'], roles: [UserRole.stream]})
export class ArtworkController extends BaseController {
	@Inject
	artworkService!: ArtworkService;

	@Get('/id',
		() => Artwork,
		{description: 'Get an Artwork by Id', summary: 'Get Artwork'}
	)
	async id(
		@QueryParam('id', {description: 'Artwork Id', isID: true}) id: string,
		@QueryParams() artworkArgs: IncludesArtworkArgs,
		@QueryParams() artworkChildrenArgs: IncludesArtworkChildrenArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@CurrentUser() user: User
	): Promise<Artwork> {
		return this.transform.artwork(
			await this.orm.Artwork.oneOrFail(id),
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
		@CurrentUser() user: User
	): Promise<ArtworkPage> {
		if (list.list) {
			return await this.orm.Artwork.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.artwork(o, artworkArgs, artworkChildrenArgs, folderArgs, user)
			);
		}
		return await this.orm.Artwork.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.artwork(o, artworkArgs, artworkChildrenArgs, folderArgs, user)
		);
	}

	@Post(
		'/create',
		() => AdminChangeQueueInfo,
		{description: 'Create an Artwork', roles: [UserRole.admin], summary: 'Create Artwork'}
	)
	async createByUrl(
		@BodyParams() args: ArtworkNewArgs,
		@CurrentUser() user: User
	): Promise<AdminChangeQueueInfo> {
		const folder = await this.orm.Folder.oneOrFail(args.folderID);
		return await this.artworkService.createByUrl(folder, args.url, args.types);
	}

	@Post(
		'/upload',
		() => AdminChangeQueueInfo,
		{description: 'Upload an Artwork', roles: [UserRole.admin], summary: 'Upload Artwork'}
	)
	async createByUpload(
		@BodyParams() args: ArtworkNewUploadArgs,
		@Upload('image') file: UploadFile,
		@CurrentUser() user: User
	): Promise<AdminChangeQueueInfo> {
		const folder = await this.orm.Folder.oneOrFail(args.folderID);
		return await this.artworkService.createByFile(folder, file.name, args.types);
	}

	@Post(
		'/update',
		() => AdminChangeQueueInfo,
		{description: 'Update an Artwork', roles: [UserRole.admin], summary: 'Update Artwork'}
	)
	async update(
		@BodyParam('id', {description: 'Artwork Id', isID: true}) id: string,
		@Upload('image') file: UploadFile,
		@CurrentUser() user: User
	): Promise<AdminChangeQueueInfo> {
		const artwork = await this.orm.Artwork.oneOrFail(id);
		return await this.artworkService.upload(artwork, file.name);
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{description: 'Rename an Artwork', roles: [UserRole.admin], summary: 'Rename Artwork'}
	)
	async rename(
		@BodyParams() args: ArtworkRenameArgs,
		@CurrentUser() user: User
	): Promise<AdminChangeQueueInfo> {
		const artwork = await this.orm.Artwork.oneOrFail(args.id);
		return await this.artworkService.rename(artwork, args.newName);
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{description: 'Remove an Artwork', roles: [UserRole.admin], summary: 'Remove Artwork'}
	)
	async remove(
		@BodyParam('id', {description: 'Artwork Id', isID: true}) id: string,
		@CurrentUser() user: User
	): Promise<AdminChangeQueueInfo> {
		const artwork = await this.orm.Artwork.oneOrFail(id);
		return await this.artworkService.remove(artwork);
	}

}
