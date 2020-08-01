import {Folder, FolderHealth, FolderIndex, FolderPage} from './folder.model';
import {BodyParam, BodyParams, Controller, Ctx, Get, InvalidParamError, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {TrackPage} from '../track/track.model';
import {ArtworkPage} from '../artwork/artwork.model';
import {ExtendedInfoResult} from '../metadata/metadata.model';
import {IncludesTrackArgs, TrackOrderArgs} from '../track/track.args';
import {FolderCreateArgs, FolderFilterArgs, FolderMoveArgs, FolderOrderArgs, FolderRenameArgs, IncludesFolderArgs, IncludesFolderChildrenArgs} from './folder.args';
import {ArtworkOrderArgs, IncludesArtworkArgs} from '../artwork/artwork.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {AdminChangeQueueInfo} from '../admin/admin';
import {Context} from '../../modules/engine/rest/context';

@Controller('/folder', {tags: ['Folder'], roles: [UserRole.stream]})
export class FolderController {

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
		@Ctx() {orm, engine, user}: Context
	): Promise<Folder> {
		return engine.transform.folder(
			orm, await orm.Folder.oneOrFailByID(id),
			folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user
		);
	}

	@Get(
		'/index',
		() => FolderIndex,
		{description: 'Get the Navigation Index for Folders', summary: 'Get Index'}
	)
	async index(
		@QueryParams() filter: FolderFilterArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<FolderIndex> {
		const result = await orm.Folder.indexFilter(filter, user);
		return engine.transform.folderIndex(orm, result);
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
		@Ctx() {orm, engine, user}: Context
	): Promise<FolderPage> {
		if (list.list) {
			return await orm.Folder.findListTransformFilter(list.list, filter, [order], page, user,
				o => engine.transform.folder(orm, o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user)
			);
		}
		return await orm.Folder.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.folder(orm, o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user)
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
		@Ctx() {orm, engine, user}: Context
	): Promise<TrackPage> {
		const folderIDs = await orm.Folder.findIDsFilter(filter, user);
		return await orm.Track.searchTransformFilter(
			{folderIDs}, [order], page, user,
			o => engine.transform.trackBase(orm, o, trackArgs, user)
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
		@Ctx() {orm, engine, user}: Context
	): Promise<FolderPage> {
		const folderIDs = await orm.Folder.findIDsFilter(filter, user);
		return await orm.Folder.searchTransformFilter(
			{parentIDs: folderIDs}, [order], page, user,
			o => engine.transform.folderBase(orm, o, folderArgs, user)
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
		@Ctx() {orm, engine, user}: Context
	): Promise<ArtworkPage> {
		const folderIDs = await orm.Folder.findIDsFilter(filter, user);
		return await orm.Artwork.searchTransformFilter(
			{folderIDs}, [order], page, user,
			o => engine.transform.artworkBase(orm, o, artworkArgs, user)
		);
	}

	@Get(
		'/artist/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Artist by Folder Id (External Service)', summary: 'Get Artist Info'}
	)
	async artistInfo(
		@QueryParam('id', {description: 'Folder Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<ExtendedInfoResult> {
		const folder = await orm.Folder.oneOrFailByID(id);
		return {info: await engine.metadata.extInfo.byFolderArtist(orm, folder)};
	}

	@Get(
		'/album/info',
		() => ExtendedInfoResult,
		{description: 'Get Meta Data Info of an Album by Folder Id (External Service)', summary: 'Get Album Info'}
	)
	async albumInfo(
		@QueryParam('id', {description: 'Folder Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<ExtendedInfoResult> {
		const folder = await orm.Folder.oneOrFailByID(id);
		return {info: await engine.metadata.extInfo.byFolderAlbum(orm, folder)};
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
		@Ctx() {orm, engine, user}: Context
	): Promise<FolderPage> {
		const folder = await orm.Folder.oneOrFailByID(id);
		const result = await engine.metadata.similarArtists.byFolder(orm, folder, page);
		return {...result, items: await Promise.all(result.items.map(o => engine.transform.folderBase(orm, o, folderArgs, user)))};
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
		@Ctx() {orm, engine, user}: Context
	): Promise<TrackPage> {
		const folder = await orm.Folder.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byFolder(orm, folder, page);
		return {...result, items: await Promise.all(result.items.map(o => engine.transform.trackBase(orm, o, trackArgs, user)))};
	}

	@Get(
		'/health',
		() => [FolderHealth],
		{description: 'Get a List of Folders with Health Issues', roles: [UserRole.admin], summary: 'Get Health'}
	)
	async health(
		@QueryParams() filter: FolderFilterArgs,
		@QueryParams() folderArgs: IncludesFolderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Array<FolderHealth>> {
		const folders = await orm.Folder.findFilter(filter, [], {}, user);
		const list = await engine.folder.health(orm, folders);
		const result: Array<FolderHealth> = [];
		for (const item of list) {
			result.push({
				folder: await engine.transform.folderBase(orm, item.folder, folderArgs, user),
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
	async create(
		@BodyParams() args: FolderCreateArgs,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(args.id);
		return await engine.io.newFolder(folder.id, args.name, folder.root.idOrFail());
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{description: 'Rename a folder', roles: [UserRole.admin], summary: 'Rename Folder'}
	)
	async rename(
		@BodyParams() args: FolderRenameArgs,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(args.id);
		return await engine.io.renameFolder(folder.id, args.name, folder.root.idOrFail());
	}

	@Post(
		'/move',
		() => AdminChangeQueueInfo,
		{description: 'Move a Folder', roles: [UserRole.admin], summary: 'Move Folder'}
	)
	async move(
		@BodyParams() args: FolderMoveArgs,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		if (args.ids.length === 0) {
			throw InvalidParamError('ids', 'Must have entries');
		}
		const folder = await orm.Folder.oneOrFailByID(args.ids[0]);
		return await engine.io.moveFolders(args.ids, args.newParentID, folder.root.idOrFail());
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{description: 'Remove a Folder', summary: 'Remove Folder'}
	)
	async remove(
		@BodyParam('id', {description: 'Folder Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(id);
		return await engine.io.deleteFolder(folder.id, folder.root.idOrFail());
	}

}
