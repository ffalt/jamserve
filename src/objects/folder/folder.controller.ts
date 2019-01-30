import {JamParameters} from '../../model/jam-rest-params';
import {ArtworkImageType, FolderType} from '../../model/jam-types';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {TrackController} from '../track/track.controller';
import {formatAlbumFolderInfo, formatArtistFolderInfo, formatFolder, formatFolderArtwork, formatFolderArtworks} from './folder.format';
import {formatState} from '../state/state.format';
import {formatFolderIndex} from '../../engine/index/index.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {SearchQueryFolder} from './folder.store';
import {SearchQueryTrack} from '../track/track.store';
import {MetaDataService} from '../metadata/metadata.service';
import {IndexService} from '../../engine/index/index.service';
import {User} from '../user/user.model';
import {FolderService} from './folder.service';
import path from 'path';
import {Jam} from '../../model/jam-rest-data';
import {Artwork, Folder} from './folder.model';
import {IApiBinaryResult} from '../../typings';
import {FolderRulesChecker} from '../../engine/health/folder.rule';
import {DBObjectType} from '../../db/db.types';

export class FolderController extends BaseListController<JamParameters.Folder, JamParameters.Folders, JamParameters.IncludesFolderChildren, SearchQueryFolder, JamParameters.FolderSearch, Folder, Jam.Folder> {
	checker = new FolderRulesChecker();

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
			result.folders = await this.prepareList(folders, {folderState: includes.folderState, folderHealth: includes.folderHealth, folderCounts: includes.folderCounts, folderTag: includes.folderTag}, user);
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
			result.health = await this.checker.run(folder);
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

	async artworks(req: JamRequest<JamParameters.ID>): Promise<Array<Jam.ArtworkImage>> {
		const folder = await this.byID(req.query.id);
		return formatFolderArtworks(folder);
	}

	private async artworkByID(id: string): Promise<{ artwork: Artwork, folder: Folder }> {
		const folderID = id.split('-')[0];
		const folder = await this.byID(folderID);
		const artwork = (folder.tag.artworks || []).find(art => art.id === id);
		if (!artwork) {
			return Promise.reject(NotFoundError());
		}
		return {folder, artwork};
	}

	async artworkImage(req: JamRequest<JamParameters.Image>): Promise<IApiBinaryResult> {
		const {folder, artwork} = await this.artworkByID(req.query.id);
		return await this.folderService.getArtworkImage(folder, artwork, req.query.size, req.query.format);
	}

	async artworkCreate(req: JamRequest<JamParameters.FolderArtworkNew>): Promise<Jam.ArtworkImage> {
		const folder = await this.byID(req.query.id);
		const artwork = await this.folderService.downloadFolderArtwork(folder, req.query.url, <Array<ArtworkImageType>>req.query.types);
		return formatFolderArtwork(artwork);
	}

	async artworkDelete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const {folder, artwork} = await this.artworkByID(req.query.id);
		return await this.folderService.removeArtworkImage(folder, artwork);
	}

	async health(req: JamRequest<JamParameters.FolderHealth>): Promise<Array<Jam.Folder>> {
		const list = await this.service.store.search(this.translateQuery(req.query, req.user));
		req.query.folderHealth = true;
		const folders = await this.prepareList(list, req.query, req.user);
		return folders.filter(f => f.health && f.health.length > 0);
	}
}
