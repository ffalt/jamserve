import { Inject, InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Folder as ORMFolder } from './folder.js';
import { IncludesFolderParameters, IncludesFolderChildrenParameters } from './folder.parameters.js';
import { User } from '../user/user.js';
import { FolderIndex } from './folder.model.js';
import { DBObjectType, FolderType } from '../../types/enums.js';
import { MetaDataService } from '../metadata/metadata.service.js';
import { IndexResult, IndexResultGroup } from '../base/base.js';
import { GenreTransformService } from '../genre/genre.transform.js';
import { ExtendedInfo } from '../metadata/metadata.model.js';
import { GenreBase } from '../genre/genre.model.js';
import { FolderBase, FolderParent, FolderTag } from './folder-base.model.js';

@InRequestScope
export class FolderTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;

	@Inject
	public Genre!: GenreTransformService;

	async folderBases(orm: Orm, list: Array<ORMFolder>, folderParameters: IncludesFolderParameters, user: User): Promise<Array<FolderBase>> {
		return await Promise.all(list.map(o => this.folderBase(orm, o, folderParameters, user)));
	}

	async folderInfo(orm: Orm, o: ORMFolder): Promise<ExtendedInfo | undefined> {
		return o.folderType === FolderType.artist ?
			await this.metaData.extInfo.byFolderArtist(orm, o) :
			await this.metaData.extInfo.byFolderAlbum(orm, o);
	}

	async folderGenres(orm: Orm, o: ORMFolder, user: User): Promise<Array<GenreBase>> {
		return this.Genre.genreBases(orm, await o.genres.getItems(), {}, user);
	}

	async folderBase(orm: Orm, o: ORMFolder, folderParameters: IncludesFolderParameters, user: User): Promise<FolderBase> {
		return {
			id: o.id,
			name: o.name,
			title: o.title,
			created: o.createdAt.valueOf(),
			type: o.folderType,
			level: o.level,
			parentID: o.parent.id(),
			genres: folderParameters.folderIncGenres ? await this.folderGenres(orm, o, user) : undefined,
			trackCount: folderParameters.folderIncTrackCount ? await o.tracks.count() : undefined,
			folderCount: folderParameters.folderIncChildFolderCount ? await o.children.count() : undefined,
			artworkCount: folderParameters.folderIncArtworkCount ? await o.children.count() : undefined,
			tag: folderParameters.folderIncTag ? await this.folderTag(o) : undefined,
			parents: folderParameters.folderIncParents ? await this.folderParents(orm, o) : undefined,
			trackIDs: folderParameters.folderIncTrackIDs ? await o.tracks.getIDs() : undefined,
			folderIDs: folderParameters.folderIncFolderIDs ? await o.children.getIDs() : undefined,
			artworkIDs: folderParameters.folderIncArtworkIDs ? await o.artworks.getIDs() : undefined,
			info: folderParameters.folderIncInfo ? await this.folderInfo(orm, o) : undefined,
			state: folderParameters.folderIncSimilar ? await this.state(orm, o.id, DBObjectType.folder, user.id) : undefined
		};
	}

	async folderChildren(orm: Orm, o: ORMFolder, folderChildrenParameters: IncludesFolderChildrenParameters, user: User): Promise<Array<FolderBase>> {
		const folderParameters: IncludesFolderParameters = {
			folderIncTag: folderChildrenParameters.folderChildIncTag,
			folderIncState: folderChildrenParameters.folderChildIncState,
			folderIncChildFolderCount: folderChildrenParameters.folderChildIncChildFolderCount,
			folderIncTrackCount: folderChildrenParameters.folderChildIncTrackCount,
			folderIncArtworkCount: folderChildrenParameters.folderChildIncArtworkCount,
			folderIncParents: folderChildrenParameters.folderChildIncParents,
			folderIncInfo: folderChildrenParameters.folderChildIncInfo,
			folderIncSimilar: folderChildrenParameters.folderChildIncSimilar,
			folderIncArtworkIDs: folderChildrenParameters.folderChildIncArtworkIDs,
			folderIncTrackIDs: folderChildrenParameters.folderChildIncTrackIDs,
			folderIncFolderIDs: folderChildrenParameters.folderChildIncFolderIDs
		};
		const items = await o.children.getItems();
		return await Promise.all(items.map(t => this.folderBase(orm, t, folderParameters, user)));
	}

	async folderIndex(_orm: Orm, result: IndexResult<IndexResultGroup<ORMFolder>>): Promise<FolderIndex> {
		return this.index(result, async item => {
			return {
				id: item.id,
				name: item.name,
				trackCount: await item.tracks.count()
			};
		});
	}

	async folderTag(o: ORMFolder): Promise<FolderTag> {
		const genres = await o.genres.getItems();
		return {
			album: o.album,
			albumType: o.albumType,
			artist: o.artist,
			artistSort: o.artistSort,
			genres: genres.map(g => g.name),
			year: o.year,
			mbArtistID: o.mbArtistID,
			mbReleaseID: o.mbReleaseID,
			mbReleaseGroupID: o.mbReleaseGroupID
		};
	}

	async folderParents(_orm: Orm, o: ORMFolder): Promise<Array<FolderParent>> {
		const result: Array<FolderParent> = [];
		let parent: ORMFolder | undefined = o;
		while (parent) {
			parent = await parent.parent.get();
			if (parent) {
				result.unshift({ id: parent.id, name: parent.name });
			}
		}
		return result;
	}
}
