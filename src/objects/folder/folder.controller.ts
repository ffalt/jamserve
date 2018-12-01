import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType, FolderType} from '../../types';
import {getFolderProblems} from '../../engine/io/components/health';
import {InvalidParamError} from '../../api/jam/error';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {TrackController} from '../track/track.controller';
import {formatFolder, formatAlbumFolderInfo, formatArtistFolderInfo} from './folder.format';
import {formatState} from '../state/state.format';
import {formatFolderIndex} from '../../engine/index/index.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {FolderStore, SearchQueryFolder} from './folder.store';
import {SearchQueryTrack} from '../track/track.store';
import {MetaDataService} from '../../engine/metadata/metadata.service';
import {RootService} from '../root/root.service';
import {IndexService} from '../../engine/index/index.service';
import {ListService} from '../../engine/list/list.service';
import {Folder} from './folder.model';
import {User} from '../user/user.model';
import * as path from 'path';

export class FolderController extends BaseListController<JamParameters.Folder, JamParameters.Folders, JamParameters.IncludesFolderChildren, SearchQueryFolder, JamParameters.FolderSearch, Folder, Jam.Folder> {

	constructor(
		private folderStore: FolderStore,
		private trackController: TrackController,
		private metadataService: MetaDataService,
		private indexService: IndexService,
		private rootService: RootService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService,
		protected listService: ListService
	) {
		super(folderStore, DBObjectType.folder, stateService, imageService, downloadService, listService);
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
			const folders = await this.folderStore.search({parentID: folder.id, sorts: [{field: 'name', descending: false}]});
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
			result.parents = await this.rootService.getFolderParents(folder);
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
		const list = await this.folderStore.search({parentID: req.query.id});
		return this.prepareList(list, req.query, req.user);
	}

	async tracks(req: JamRequest<JamParameters.FolderTracks>): Promise<Array<Jam.Track>> {
		const folders = await this.byIDs(req.query.ids);
		const trackQuery: SearchQueryTrack = req.query.recursive ? {inPaths: folders.map(folder => folder.path)} : {parentIDs: folders.map(folder => folder.id)};
		return this.trackController.prepareByQuery(trackQuery, req.query, req.user);
	}

	async children(req: JamRequest<JamParameters.FolderChildren>): Promise<Jam.FolderChildren> {
		const folders = await this.folderStore.search({parentID: req.query.id});
		const resultTracks = await this.trackController.prepareByQuery({parentID: req.query.id}, req.query, req.user);
		const resultFolders = await this.prepareList(folders, req.query, req.user);
		return {folders: resultFolders, tracks: resultTracks};
	}

	async imageUrlUpdate(req: JamRequest<JamParameters.FolderEditImg>): Promise<void> {
		const folder = await this.byID(req.query.id);
		await this.imageService.downloadFolderImage(folder, req.query.url);
	}

	async imageUploadUpdate(req: JamRequest<JamParameters.ID>): Promise<void> {
		if (!req.file) {
			return Promise.reject(InvalidParamError('Image upload failed'));
		}
		const folder = await this.byID(req.query.id);
		await this.imageService.setFolderImage(folder, req.file);
	}

	async nameUpdate(req: JamRequest<JamParameters.FolderEditName>): Promise<void> {
		const folder = await this.byID(req.query.id);
		await this.rootService.renameFolder(folder, req.query.name);
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
		const folderIndex = await this.indexService.getFolderIndex();
		return formatFolderIndex(this.indexService.filterFolderIndex(req.query.rootID, folderIndex));
	}

}
