import {JamParameters} from '../../model/jam-rest-params';
import {DBObjectType, FolderType, FolderTypesAlbum} from '../../model/jam-types';
import {InvalidParamError} from '../../api/jam/error';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {TrackController} from '../track/track.controller';
import {formatAlbumFolderInfo, formatArtistFolderInfo, formatFolder} from './folder.format';
import {formatState} from '../state/state.format';
import {formatFolderIndex} from '../../engine/index/index.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {SearchQueryFolder} from './folder.store';
import {SearchQueryTrack} from '../track/track.store';
import {MetaDataService} from '../../engine/metadata/metadata.service';
import {IndexService} from '../../engine/index/index.service';
import {User} from '../user/user.model';
import {FolderService} from './folder.service';
import path from 'path';
import {Jam} from '../../model/jam-rest-data';
import {replaceFileSystemChars} from '../../utils/fs-utils';
import {Folder, FolderTag} from './folder.model';

interface ProblemCheck {
	name: string;
	check: (folder: Folder) => Promise<boolean>;
}


function getNiceFolderName(tag: FolderTag): string {
	const year = tag.year ? tag.year.toString() : '';
	const s = (year.length > 0 ? '[' + year + '] ' : '') + replaceFileSystemChars(tag.album || '', '_');
	return s.trim();
}

const ProblemDefs: { [id: string]: ProblemCheck; } = {
	FOLDER_TAG_MISSING: {
		name: 'Missing TAG',
		check: async (folder) => {
			return !folder.tag;
		}
	},
	FOLDER_TAG_VALUES_MISSING: {
		name: 'Missing Tag Values (album, artist, year)',
		check: async (folder) => {
			return folder.tag &&
				(
					(folder.tag.type === FolderType.album) ||
					(folder.tag.type === FolderType.multialbum)
				) &&
				(
					(!folder.tag.album) || (!folder.tag.artist) || (!folder.tag.year)
				);
		}
	},
	ALBUM_IMAGE_MISSING: {
		name: 'Missing album image',
		check: async (folder) => {
			return !!folder.tag &&
				((folder.tag.type === FolderType.album) || (folder.tag.type === FolderType.multialbum))
				&& !folder.tag.image;
		}
	},
	ALBUM_IMAGE_NAME_NONCONFORM: {
		name: 'Album Image Name is not cover.[ext]',
		check: async (folder) => {
			return !!folder.tag &&
				(
					(folder.tag.type === FolderType.album) ||
					(folder.tag.type === FolderType.multialbum)
				)
				&& !!folder.tag.image &&
				folder.tag.image.indexOf('cover.') !== 0;
		}

	},
	ALBUM_NAME_NONCONFORM: {
		name: 'Album folder name is not "[Year] Album-Name"',
		check: async (folder) => {
			if (folder.tag && (FolderTypesAlbum.indexOf(folder.tag.type) > 0) &&
				(folder.tag.album) && (folder.tag.year) && (folder.tag.year > 0)) {
				const name = path.basename(folder.path).trim().replace(/[_:!?\/ ]/g, '').toLowerCase();
				const nicename = getNiceFolderName(folder.tag).replace(/[_:!?\/ ]/g, '').toLowerCase();
				return name.localeCompare(nicename) !== 0;
			}
			return false;
		}

	},
	ALBUM_GENRE_MISSING: {
		name: 'Album genre is missing',
		check: async (folder) => {
			return (folder.tag && (!folder.tag.genre || folder.tag.genre.length === 0));
		}

	},
	ALBUM_ID_MISSING: {
		name: 'Missing musicbrainz album id',
		check: async (folder) => {
			return folder.tag && (
				(folder.tag.type === FolderType.album) ||
				(folder.tag.type === FolderType.multialbum)
			) && !folder.tag.mbAlbumID;
		}
	},
	ARTIST_IMAGE_NAME_NONCONFORM: {
		name: 'Artist Image Name is not artist.[ext]',
		check: async (folder) => {
			return (!!folder.tag) &&
				(
					(folder.tag.type === FolderType.artist) ||
					(folder.tag.type === FolderType.multiartist)
				) && (!!folder.tag.image) && folder.tag.image.indexOf('artist.') !== 0;
		}

	},
	ARTIST_IMAGE_MISSING: {
		name: 'Missing artist image',
		check: async (folder) => {
			return !!folder.tag && (
					(folder.tag.type === FolderType.artist) ||
					(folder.tag.type === FolderType.multiartist)
				)
				&& !folder.tag.image;
		}
	}
};

export async function getFolderProblems(node: Folder): Promise<Array<Jam.FolderProblem>> {
	const probs: Array<Jam.FolderProblem> = [];
	const keys = Object.keys(ProblemDefs);
	for (const key of keys) {
		if (ProblemDefs[key].check) {
			const match = await ProblemDefs[key].check(node);
			if (match) {
				probs.push({id: key, name: ProblemDefs[key].name});
			}
		}
	}
	return probs;
}

export class FolderController extends BaseListController<JamParameters.Folder, JamParameters.Folders, JamParameters.IncludesFolderChildren, SearchQueryFolder, JamParameters.FolderSearch, Folder, Jam.Folder> {

	constructor(
		protected folderService: FolderService,
		private trackController: TrackController,
		private metadataService: MetaDataService,
		private indexService: IndexService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(folderService, stateService, imageService, downloadService);
	}

	defaultSort(items: Array<Folder>): Array<Folder> {
		return items.sort((a, b) => (a.tag && a.tag.title ? a.tag.title : path.basename(a.path)).localeCompare((b.tag && b.tag.title ? b.tag.title : path.basename(b.path))));
	}

	async prepare(folder: Folder, includes: JamParameters.IncludesFolderChildren, user: User): Promise<Jam.Folder> {
		const result = formatFolder(folder, includes);
		if (includes.folderChildren || includes.folderTracks) {
			result.tracks = await this.trackController.prepareByQuery({parentID: folder.id}, includes, user);
		}
		if (includes.folderChildren || includes.folderSubfolders) {
			const folders = await this.folderService.folderStore.search({parentID: folder.id, sorts: [{field: 'name', descending: false}]});
			// TODO: introduce children includes?
			result.folders = await this.prepareList(folders, {folderState: includes.folderState, folderHealth: includes.folderHealth, folderTag: includes.folderTag}, user);
		}
		if (includes.folderState) {
			const state = await this.stateService.findOrCreate(folder.id, user.id, DBObjectType.folder);
			result.state = formatState(state);
		}
		if (includes.folderInfo) {
			if (folder.tag.type === FolderType.artist) {
				const infos = await this.metadataService.getFolderArtistInfo(folder, false, !!includes.folderInfoSimilar);
				result.artistInfo = formatArtistFolderInfo(infos.info);
				if (includes.folderInfoSimilar) {
					const similar: Array<Jam.Folder> = [];
					(infos.similar || []).forEach(sim => {
						if (sim.folder) {
							similar.push(formatFolder(sim.folder, includes));
						}
					});
					result.artistInfo.similar = similar;
				}
			} else {
				const info = await this.metadataService.getFolderInfo(folder);
				result.albumInfo = formatAlbumFolderInfo(info);
			}
		}
		if (includes.folderHealth) {
			const problems = await getFolderProblems(folder);
			result.health = {problems};
		}
		if (includes.folderParents) {
			const parents = await this.folderService.collectFolderPath(folder.parentID);
			result.parents = parents.map(parent => {
				return {
					id: parent.id,
					name: path.basename(parent.path)
				};
			});
		}
		return result;
	}

	translateQuery(query: JamParameters.FolderSearch, user: User): SearchQueryFolder {
		return {
			query: query.query,
			rootID: query.rootID,
			parentID: query.parentID,
			artist: query.artist,
			title: query.title,
			album: query.album,
			genre: query.genre,
			level: query.level,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			types: query.type ? [query.type] : undefined,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	/* more folder api */

	async subfolders(req: JamRequest<JamParameters.FolderSubFolders>): Promise<Array<Jam.Folder>> {
		const list = await this.folderService.folderStore.search({parentID: req.query.id});
		return this.prepareList(list, req.query, req.user);
	}

	async tracks(req: JamRequest<JamParameters.FolderTracks>): Promise<Array<Jam.Track>> {
		const folders = await this.byIDs(req.query.ids);
		const trackQuery: SearchQueryTrack = req.query.recursive ? {inPaths: folders.map(folder => folder.path)} : {parentIDs: folders.map(folder => folder.id)};
		return this.trackController.prepareByQuery(trackQuery, req.query, req.user);
	}

	async children(req: JamRequest<JamParameters.FolderChildren>): Promise<Jam.FolderChildren> {
		const folders = await this.folderService.folderStore.search({parentID: req.query.id});
		const resultTracks = await this.trackController.prepareByQuery({parentID: req.query.id}, req.query, req.user);
		const resultFolders = await this.prepareList(folders, req.query, req.user);
		return {folders: resultFolders, tracks: resultTracks};
	}

	async imageUrlUpdate(req: JamRequest<JamParameters.FolderEditImg>): Promise<void> {
		const folder = await this.byID(req.query.id);
		await this.folderService.downloadFolderImage(folder, req.query.url);
	}

	async imageUploadUpdate(req: JamRequest<JamParameters.ID>): Promise<void> {
		if (!req.file) {
			return Promise.reject(InvalidParamError('Image upload failed'));
		}
		const folder = await this.byID(req.query.id);
		await this.folderService.setFolderImage(folder, req.file);
	}

	async nameUpdate(req: JamRequest<JamParameters.FolderEditName>): Promise<void> {
		const folder = await this.byID(req.query.id);
		await this.folderService.renameFolder(folder, req.query.name);
	}

	async artistInfo(req: JamRequest<JamParameters.ArtistInfo>): Promise<Jam.ArtistFolderInfo> {
		const folder = await this.byID(req.query.id);
		const artistInfo = await this.metadataService.getFolderArtistInfo(folder, false, req.query.similar);
		const result = formatArtistFolderInfo(artistInfo.info);
		if (req.query.similar) {
			const list = (artistInfo.similar || []).filter(s => !!s.folder).map(s => <Folder>s.folder);
			result.similar = await this.prepareList(list, {}, req.user);
		}
		return result;
	}

	async artistSimilar(req: JamRequest<JamParameters.Folder>): Promise<Array<Jam.Folder>> {
		const folder = await this.byID(req.query.id);
		const artistInfo = await this.metadataService.getFolderArtistInfo(folder, false, true);
		const list = (artistInfo.similar || []).filter(s => !!s.folder).map(s => <Folder>s.folder);
		return this.prepareList(list, req.query, req.user);
	}

	async albumInfo(req: JamRequest<JamParameters.AlbumInfo>): Promise<Jam.AlbumFolderInfo> {
		const folder = await this.byID(req.query.id);
		const info = await this.metadataService.getFolderInfo(folder);
		return formatAlbumFolderInfo(info);
	}

	async artistSimilarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const folder = await this.byID(req.query.id);
		const tracks = await this.metadataService.getFolderSimilarTracks(folder);
		return this.trackController.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: JamRequest<JamParameters.FolderList>): Promise<Array<Jam.Folder>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async index(req: JamRequest<JamParameters.Index>): Promise<Jam.FolderIndex> {
		const folderIndex = await this.indexService.getFolderIndex(false);
		return formatFolderIndex(this.indexService.filterFolderIndex(req.query.rootID, folderIndex));
	}

}
