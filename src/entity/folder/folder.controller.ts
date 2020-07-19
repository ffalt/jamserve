import {Folder, FolderHealth, FolderIndex, FolderPage} from './folder.model';
import {User} from '../user/user';
import {BodyParam, BodyParams, Controller, CurrentUser, Get, InvalidParamError, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {TrackPage} from '../track/track.model';
import {ArtworkPage} from '../artwork/artwork.model';
import {BaseController} from '../base/base.controller';
import {ExtendedInfoResult} from '../metadata/metadata.model';
import {IncludesTrackArgs, TrackOrderArgs} from '../track/track.args';
import {FolderCreateArgs, FolderFilterArgs, FolderMoveArgs, FolderOrderArgs, FolderRenameArgs, IncludesFolderArgs, IncludesFolderChildrenArgs} from './folder.args';
import {ArtworkOrderArgs, IncludesArtworkArgs} from '../artwork/artwork.args';
import {Inject} from 'typescript-ioc';
import {FolderService} from './folder.service';
import {ListArgs, PageArgs} from '../base/base.args';
import {AdminChangeQueueInfo} from '../admin/admin';
import {IoService} from '../../modules/engine/services/io.service';

@Controller('/folder', {tags: ['Folder'], roles: [UserRole.stream]})
export class FolderController extends BaseController {
	@Inject
	folderService!: FolderService;
	@Inject
	ioService!: IoService;

	@Get('/id',
		() => Folder,
		{description: 'Get a Folder by Id', summary: 'Get Folder'}
	)
	async id(
		@QueryParam('id', {description: 'Folder Id', isID: true}) id: string,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@QueryParams() folderChildrenArgs: IncludesFolderChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() artworkArgs: IncludesArtworkArgs,
		@CurrentUser() user: User
	): Promise<Folder> {
		return this.transform.folder(
			await this.orm.Folder.oneOrFail(id),
			folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user
		);
	}

	@Get(
		'/index',
		() => FolderIndex,
		{description: 'Get the Navigation Index for Folders', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: FolderFilterArgs, @CurrentUser() user: User): Promise<FolderIndex> {
		const result = await this.orm.Folder.indexFilter(filter, user);
		return this.transform.folderIndex(result);
	}

	@Get(
		'/search',
		() => FolderPage,
		{description: 'Search Folders'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@QueryParams() folderChildrenArgs: IncludesFolderChildrenArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() artworkArgs: IncludesArtworkArgs,
		@QueryParams() filter: FolderFilterArgs,
		@QueryParams() order: FolderOrderArgs,
		@QueryParams() list: ListArgs,
		@CurrentUser() user: User
	): Promise<FolderPage> {
		if (list.list) {
			return await this.orm.Folder.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.folder(o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user)
			);
		}
		return await this.orm.Folder.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.folder(o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user)
		);
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{description: 'Get Tracks of Folders', summary: 'Get Tracks'}
	)
	async tracks(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: FolderFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const folderIDs = await this.orm.Folder.findIDsFilter(filter, user);
		return await this.orm.Track.searchTransformFilter(
			{folderIDs}, [order], page, user,
			o => this.transform.trackBase(o, trackArgs, user)
		);
	}

	@Get(
		'/subfolders',
		() => TrackPage,
		{description: 'Get Child Folders of Folders', summary: 'Get Sub-Folders'}
	)
	async subfolders(
		@QueryParams() page: PageArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@QueryParams() filter: FolderFilterArgs,
		@QueryParams() order: FolderOrderArgs,
		@CurrentUser() user: User
	): Promise<FolderPage> {
		const folderIDs = await this.orm.Folder.findIDsFilter(filter, user);
		return await this.orm.Folder.searchTransformFilter(
			{parentIDs: folderIDs}, [order], page, user,
			o => this.transform.folderBase(o, folderArgs, user)
		);
	}

	@Get(
		'/artworks',
		() => ArtworkPage,
		{description: 'Get Artworks of Folders', summary: 'Get Artwork'}
	)
	async artworks(
		@QueryParams() page: PageArgs,
		@QueryParams() artworkArgs: IncludesArtworkArgs,
		@QueryParams() filter: FolderFilterArgs,
		@QueryParams() order: ArtworkOrderArgs,
		@CurrentUser() user: User
	): Promise<ArtworkPage> {
		const folderIDs = await this.orm.Folder.findIDsFilter(filter, user);
		return await this.orm.Artwork.searchTransformFilter(
			{folderIDs}, [order], page, user,
			o => this.transform.artworkBase(o, artworkArgs, user)
		);
	}

	@Get(
		'/artist/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Artist by Folder Id (External Service)', summary: 'Get Artist Info'}
	)
	async artistInfo(@QueryParam('id', {description: 'Folder Id', isID: true}) id: string): Promise<ExtendedInfoResult> {
		const folder = await this.orm.Folder.oneOrFail(id);
		return {info: await this.metadata.extInfo.byFolderArtist(folder)};
	}

	@Get(
		'/album/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Album by Folder Id (External Service)', summary: 'Get Album Info'}
	)
	async albumInfo(@QueryParam('id', {description: 'Folder Id', isID: true}) id: string): Promise<ExtendedInfoResult> {
		const folder = await this.orm.Folder.oneOrFail(id);
		return {info: await this.metadata.extInfo.byFolderAlbum(folder)};
	}

	@Get(
		'/artist/similar',
		() => FolderPage,
		{description: 'Get similar Artist Folders of a Folder by Id (External Service)', summary: 'Get similar Artists'}
	)
	async artistsSimilar(
		@QueryParam('id', {description: 'Folder Id', isID: true}) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@CurrentUser() user: User
	): Promise<FolderPage> {
		const folder = await this.orm.Folder.oneOrFail(id);
		const result = await this.metadata.similarArtists.byFolder(folder, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.folderBase(o, folderArgs, user)))}
	}

	@Get(
		'/artist/similar/tracks',
		() => TrackPage,
		{description: 'Get similar Tracks of a Artist Folder by Id (External Service)', summary: 'Get similar Tracks'}
	)
	async artistsSimilarTracks(
		@QueryParam('id', {description: 'Folder Id', isID: true}) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const folder = await this.orm.Folder.oneOrFail(id);
		const result = await this.metadata.similarTracks.byFolder(folder, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user)))}
	}

	@Get(
		'/health',
		() => [FolderHealth],
		{description: 'Get a List of Folders with Health Issues', roles: [UserRole.admin], summary: 'Get Health'}
	)
	async health(
		@QueryParams() filter: FolderFilterArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@CurrentUser() user: User
	): Promise<Array<FolderHealth>> {
		const folders = await this.orm.Folder.findFilter(filter, undefined, user);
		const list = await this.folderService.health(folders);
		const result: Array<FolderHealth> = [];
		for (const item of list) {
			result.push({
				folder: await this.transform.folderBase(item.folder, folderArgs, user),
				health: item.health
			});
		}
		return result;
	}

	@Post(
		'/create',
		() => AdminChangeQueueInfo,
		{description: 'Create a Folder', roles: [UserRole.admin], summary: 'Create Folder'}
	)
	async create(@BodyParams() args: FolderCreateArgs): Promise<AdminChangeQueueInfo> {
		const folder = await this.orm.Folder.oneOrFail(args.id);
		return await this.ioService.newFolder(folder.id, args.name, folder.root.id);
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{description: 'Rename a folder', roles: [UserRole.admin], summary: 'Rename Folder'}
	)
	async rename(@BodyParams() args: FolderRenameArgs
	): Promise<AdminChangeQueueInfo> {
		const folder = await this.orm.Folder.oneOrFail(args.id);
		return await this.ioService.renameFolder(folder.id, args.name, folder.root.id);
	}

	@Post(
		'/move',
		() => AdminChangeQueueInfo,
		{description: 'Move a Folder', roles: [UserRole.admin], summary: 'Move Folder'}
	)
	async move(@BodyParams() args: FolderMoveArgs): Promise<AdminChangeQueueInfo> {
		if (args.ids.length === 0) {
			throw InvalidParamError('ids', 'Must have entries');
		}
		const folder = await this.orm.Folder.oneOrFail(args.ids[0]);
		return await this.ioService.moveFolders(args.ids, args.newParentID, folder.root.id);
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{description: 'Remove a Folder', summary: 'Remove Folder'}
	)
	async remove(
		@BodyParam('id', {description: 'Folder Id', isID: true}) id: string,
		@CurrentUser() user: User
	): Promise<AdminChangeQueueInfo> {
		const folder = await this.orm.Folder.oneOrFail(id);
		return await this.ioService.deleteFolder(folder.id, folder.root.id);
	}

}
