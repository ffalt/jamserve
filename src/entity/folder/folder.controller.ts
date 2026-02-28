import { Folder, FolderHealth, FolderIndex, FolderPage } from './folder.model.js';
import { UserRole } from '../../types/enums.js';
import { TrackPage } from '../track/track.model.js';
import { ArtworkPage } from '../artwork/artwork.model.js';
import { ExtendedInfoResult } from '../metadata/metadata.model.js';
import { IncludesTrackParameters, TrackOrderParameters } from '../track/track.parameters.js';
import { FolderCreateParameters, FolderFilterParameters, FolderMoveParameters, FolderOrderParameters, FolderRenameParameters, IncludesFolderParameters, IncludesFolderChildrenParameters } from './folder.parameters.js';
import { ArtworkOrderParameters, IncludesArtworkParameters } from '../artwork/artwork.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { invalidParameterError } from '../../modules/deco/express/express-error.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

@Controller('/folder', { tags: ['Folder'], roles: [UserRole.stream] })
export class FolderController {
	@Get('/id',
		() => Folder,
		{ description: 'Get a Folder by Id', summary: 'Get Folder' }
	)
	async id(
		@QueryParameter('id', { description: 'Folder Id', isID: true }) id: string,
		@QueryParameters() folderParameters: IncludesFolderParameters,
		@QueryParameters() folderChildrenParameters: IncludesFolderChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() artworkParameters: IncludesArtworkParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Folder> {
		return engine.transform.folder(
			orm, await orm.Folder.oneOrFailByID(id),
			folderParameters, folderChildrenParameters, trackParameters, artworkParameters, user
		);
	}

	@Get(
		'/index',
		() => FolderIndex,
		{ description: 'Get the Navigation Index for Folders', summary: 'Get Index' }
	)
	async index(
		@QueryParameters() filter: FolderFilterParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<FolderIndex> {
		const result = await orm.Folder.indexFilter(filter, user);
		return engine.transform.Folder.folderIndex(orm, result);
	}

	@Get(
		'/search',
		() => FolderPage,
		{ description: 'Search Folders' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() folderParameters: IncludesFolderParameters,
		@QueryParameters() folderChildrenParameters: IncludesFolderChildrenParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() artworkParameters: IncludesArtworkParameters,
		@QueryParameters() filter: FolderFilterParameters,
		@QueryParameters() order: FolderOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<FolderPage> {
		if (list.list) {
			return await orm.Folder.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.folder(orm, o, folderParameters, folderChildrenParameters, trackParameters, artworkParameters, user)
			);
		}
		return await orm.Folder.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.folder(orm, o, folderParameters, folderChildrenParameters, trackParameters, artworkParameters, user)
		);
	}

	@Get(
		'/tracks',
		() => TrackPage,
		{ description: 'Get Tracks of Folders', summary: 'Get Tracks' }
	)
	async tracks(
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() filter: FolderFilterParameters,
		@QueryParameters() order: TrackOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const folderIDs = await orm.Folder.findIDsFilter(filter, user);
		return await orm.Track.searchTransformFilter(
			{ folderIDs }, [order], page, user,
			o => engine.transform.Track.trackBase(orm, o, trackParameters, user)
		);
	}

	@Get(
		'/subfolders',
		() => TrackPage,
		{ description: 'Get Child Folders of Folders', summary: 'Get Sub-Folders' }
	)
	async subfolders(
		@QueryParameters() page: PageParameters,
		@QueryParameters() folderParameters: IncludesFolderParameters,
		@QueryParameters() filter: FolderFilterParameters,
		@QueryParameters() order: FolderOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<FolderPage> {
		const folderIDs = await orm.Folder.findIDsFilter(filter, user);
		return await orm.Folder.searchTransformFilter(
			{ parentIDs: folderIDs }, [order], page, user,
			o => engine.transform.Folder.folderBase(orm, o, folderParameters, user)
		);
	}

	@Get(
		'/artworks',
		() => ArtworkPage,
		{ description: 'Get Artworks of Folders', summary: 'Get Artwork' }
	)
	async artworks(
		@QueryParameters() page: PageParameters,
		@QueryParameters() artworkParameters: IncludesArtworkParameters,
		@QueryParameters() filter: FolderFilterParameters,
		@QueryParameters() order: ArtworkOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<ArtworkPage> {
		const folderIDs = await orm.Folder.findIDsFilter(filter, user);
		return await orm.Artwork.searchTransformFilter(
			{ folderIDs }, [order], page, user,
			o => engine.transform.Artwork.artworkBase(orm, o, artworkParameters, user)
		);
	}

	@Get(
		'/artist/info',
		() => ExtendedInfoResult,
		{ description: 'Get Meta Data Info of an Artist by Folder Id (External Service)', summary: 'Get Artist Info' }
	)
	async artistInfo(
		@QueryParameter('id', { description: 'Folder Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<ExtendedInfoResult> {
		const folder = await orm.Folder.oneOrFailByID(id);
		return { info: await engine.metadata.extInfo.byFolderArtist(orm, folder) };
	}

	@Get(
		'/album/info',
		() => ExtendedInfoResult,
		{ description: 'Get Meta Data Info of an Album by Folder Id (External Service)', summary: 'Get Album Info' }
	)
	async albumInfo(
		@QueryParameter('id', { description: 'Folder Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<ExtendedInfoResult> {
		const folder = await orm.Folder.oneOrFailByID(id);
		return { info: await engine.metadata.extInfo.byFolderAlbum(orm, folder) };
	}

	@Get(
		'/artist/similar',
		() => FolderPage,
		{ description: 'Get similar Artist Folders of a Folder by Id (External Service)', summary: 'Get similar Artists' }
	)
	async artistsSimilar(
		@QueryParameter('id', { description: 'Folder Id', isID: true }) id: string,
		@QueryParameters() page: PageParameters,
		@QueryParameters() folderParameters: IncludesFolderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<FolderPage> {
		const folder = await orm.Folder.oneOrFailByID(id);
		const result = await engine.metadata.similarArtists.byFolder(orm, folder, page);
		return { ...result, items: await engine.transform.Folder.folderBases(orm, result.items, folderParameters, user) };
	}

	@Get(
		'/artist/similar/tracks',
		() => TrackPage,
		{ description: 'Get similar Tracks of a Artist Folder by Id (External Service)', summary: 'Get similar Tracks' }
	)
	async artistsSimilarTracks(
		@QueryParameter('id', { description: 'Folder Id', isID: true }) id: string,
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const folder = await orm.Folder.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byFolder(orm, folder, page);
		return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
	}

	@Get(
		'/health',
		() => [FolderHealth],
		{ description: 'Get a List of Folders with Health Issues', roles: [UserRole.admin], summary: 'Get Health' }
	)
	async health(
		@QueryParameters() filter: FolderFilterParameters,
		@QueryParameters() folderParameters: IncludesFolderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Array<FolderHealth>> {
		const folders = await orm.Folder.findFilter(filter, [], {}, user);
		const list = await engine.folder.health(orm, folders);
		const result: Array<FolderHealth> = [];
		for (const item of list) {
			result.push({
				folder: await engine.transform.Folder.folderBase(orm, item.folder, folderParameters, user),
				health: item.health
			});
		}
		return result;
	}

	@Post(
		'/create',
		() => AdminChangeQueueInfo,
		{ description: 'Create a Folder', roles: [UserRole.admin], summary: 'Create Folder' }
	)
	async create(
		@BodyParameters() parameters: FolderCreateParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(parameters.id);
		return await engine.io.folder.create(folder.id, parameters.name, folder.root.idOrFail());
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{ description: 'Rename a folder', roles: [UserRole.admin], summary: 'Rename Folder' }
	)
	async rename(
		@BodyParameters() parameters: FolderRenameParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(parameters.id);
		return await engine.io.folder.rename(folder.id, parameters.name, folder.root.idOrFail());
	}

	@Post(
		'/move',
		() => AdminChangeQueueInfo,
		{ description: 'Move a Folder', roles: [UserRole.admin], summary: 'Move Folder' }
	)
	async move(
		@BodyParameters() parameters: FolderMoveParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const id = parameters.ids.at(0);
		if (parameters.ids.length === 0 || !id) {
			throw invalidParameterError('ids', 'Must have entries');
		}
		const folder = await orm.Folder.oneOrFailByID(id);
		return await engine.io.folder.move(parameters.ids, parameters.newParentID, folder.root.idOrFail());
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{ description: 'Remove a Folder', roles: [UserRole.admin], summary: 'Remove Folder' }
	)
	async remove(
		@BodyParameter('id', { description: 'Folder Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(id);
		return await engine.io.folder.delete(folder.id, folder.root.idOrFail());
	}
}
