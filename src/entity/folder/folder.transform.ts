import {Inject, InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform';
import {Orm} from '../../modules/engine/services/orm.service';
import {Folder as ORMFolder} from './folder';
import {IncludesFolderArgs, IncludesFolderChildrenArgs} from './folder.args';
import {User} from '../user/user';
import {FolderBase, FolderIndex, FolderParent, FolderTag} from './folder.model';
import {DBObjectType, FolderType} from '../../types/enums';
import {MetaDataService} from '../metadata/metadata.service';
import {IndexResult, IndexResultGroup} from '../base/base';
import {GenreTransformService} from '../genre/genre.transform';
import {ExtendedInfo} from '../metadata/metadata.model';

@InRequestScope
export class FolderTransformService extends BaseTransformService {
	@Inject
	public metaData!: MetaDataService;
	@Inject
	public Genre!: GenreTransformService;

	async folderBases(orm: Orm, list: Array<ORMFolder>, folderArgs: IncludesFolderArgs, user: User): Promise<Array<FolderBase>> {
		return await Promise.all(list.map(o => this.folderBase(orm, o, folderArgs, user)));
	}

	async folderInfo(orm: Orm, o: ORMFolder): Promise<ExtendedInfo | undefined> {
		return o.folderType === FolderType.artist ?
			await this.metaData.extInfo.byFolderArtist(orm, o) :
			await this.metaData.extInfo.byFolderAlbum(orm, o);
	}

	async folderBase(orm: Orm, o: ORMFolder, folderArgs: IncludesFolderArgs, user: User): Promise<FolderBase> {
		return {
			id: o.id,
			name: o.name,
			title: o.title,
			created: o.createdAt.valueOf(),
			type: o.folderType,
			level: o.level,
			parentID: o.parent.id(),
			genres: folderArgs.folderIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
			trackCount: folderArgs.folderIncTrackCount ? await o.tracks.count() : undefined,
			folderCount: folderArgs.folderIncChildFolderCount ? await o.children.count() : undefined,
			artworkCount: folderArgs.folderIncArtworkCount ? await o.children.count() : undefined,
			tag: folderArgs.folderIncTag ? await this.folderTag(o) : undefined,
			parents: folderArgs.folderIncParents ? await this.folderParents(orm, o) : undefined,
			trackIDs: folderArgs.folderIncTrackIDs ? await o.tracks.getIDs() : undefined,
			folderIDs: folderArgs.folderIncFolderIDs ? await o.children.getIDs() : undefined,
			artworkIDs: folderArgs.folderIncArtworkIDs ? await o.artworks.getIDs() : undefined,
			info: folderArgs.folderIncInfo ? await this.folderInfo(orm, o): undefined,
			state: folderArgs.folderIncSimilar ? await this.state(orm, o.id, DBObjectType.folder, user.id) : undefined
		};
	}

	async folderChildren(orm: Orm, o: ORMFolder, folderChildrenArgs: IncludesFolderChildrenArgs, user: User): Promise<Array<FolderBase>> {
		const folderArgs: IncludesFolderArgs = {
			folderIncTag: folderChildrenArgs.folderChildIncTag,
			folderIncState: folderChildrenArgs.folderChildIncState,
			folderIncChildFolderCount: folderChildrenArgs.folderChildIncChildFolderCount,
			folderIncTrackCount: folderChildrenArgs.folderChildIncTrackCount,
			folderIncArtworkCount: folderChildrenArgs.folderChildIncArtworkCount,
			folderIncParents: folderChildrenArgs.folderChildIncParents,
			folderIncInfo: folderChildrenArgs.folderChildIncInfo,
			folderIncSimilar: folderChildrenArgs.folderChildIncSimilar,
			folderIncArtworkIDs: folderChildrenArgs.folderChildIncArtworkIDs,
			folderIncTrackIDs: folderChildrenArgs.folderChildIncTrackIDs,
			folderIncFolderIDs: folderChildrenArgs.folderChildIncFolderIDs,
		};
		return await Promise.all((await o.children.getItems()).map(t => this.folderBase(orm, t, folderArgs, user)));
	}

	async folderIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMFolder>>): Promise<FolderIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				trackCount: await item.tracks.count()
			};
		});
	}

	async folderTag(o: ORMFolder): Promise<FolderTag> {
		return {
			album: o.album,
			albumType: o.albumType,
			artist: o.artist,
			artistSort: o.artistSort,
			genres: (await o.genres.getItems()).map(g => g.name),
			year: o.year,
			mbArtistID: o.mbArtistID,
			mbReleaseID: o.mbReleaseID,
			mbReleaseGroupID: o.mbReleaseGroupID
		};
	}

	async folderParents(orm: Orm, o: ORMFolder): Promise<Array<FolderParent>> {
		const result: Array<FolderParent> = [];
		let parent: ORMFolder | undefined = o;
		while (parent) {
			parent = await parent.parent.get();
			if (parent) {
				result.unshift({id: parent.id, name: parent.name});
			}
		}
		return result;
	}

}
