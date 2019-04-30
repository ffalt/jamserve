import {JamParameters} from '../../model/jam-rest-params';
import {ArtworkImageType, FolderType, FolderTypesAlbum} from '../../model/jam-types';
import {InvalidParamError, NotFoundError} from '../../api/jam/error';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {TrackController} from '../track/track.controller';
import {formatFolder, formatFolderArtwork, formatFolderArtworks} from './folder.format';
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
import {IoService} from '../../engine/io/io.service';
import {Root} from '../root/root.model';
import {RootService} from '../root/root.service';

export class FolderController extends BaseListController<JamParameters.Folder, JamParameters.Folders, JamParameters.IncludesFolderChildren, SearchQueryFolder, JamParameters.FolderSearch, Folder, Jam.Folder> {
	checker = new FolderRulesChecker();

	constructor(
		protected folderService: FolderService,
		private trackController: TrackController,
		private metadataService: MetaDataService,
		private indexService: IndexService,
		protected rootService: RootService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService,
		protected ioService: IoService
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
			const folders = await this.folderService.folderStore.search({parentID: folder.id, sorts: [{field: 'title', descending: false}]});
			// TODO: introduce children includes?
			result.folders = await this.prepareList(folders,
				{folderState: includes.folderState, folderCounts: includes.folderCounts, folderTag: includes.folderTag}
				, user);
		}
		if (includes.folderState) {
			const state = await this.stateService.findOrCreate(folder.id, user.id, DBObjectType.folder);
			result.state = formatState(state);
		}
		if (includes.folderInfo) {
			if (folder.tag.type === FolderType.artist) {
				result.info = await this.metadataService.getFolderArtistInfo(folder);
			} else if (FolderTypesAlbum.indexOf(folder.tag.type) >= 0) {
				result.info = await this.metadataService.getFolderAlbumInfo(folder);
			}
		}
		if (includes.folderSimilar) {
			if (folder.tag.type === FolderType.artist) {
				// TODO: introduce children includes?
				result.similar = await this.prepareList(await this.metadataService.getSimilarArtistFolders(folder),
					{folderState: includes.folderState, folderCounts: includes.folderCounts, folderTag: includes.folderTag}
					, user);
			}
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

	async translateQuery(query: JamParameters.FolderSearch, user: User): Promise<SearchQueryFolder> {
		let inPath: string | undefined;
		if (query.childOfID) {
			const folder = await this.folderService.folderStore.byId(query.childOfID);
			if (folder) {
				inPath = folder.path;
			}
		}
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			rootID: query.rootID,
			parentID: query.parentID,
			inPath,
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

	async nameUpdate(req: JamRequest<JamParameters.FolderEditName>): Promise<Jam.AdminChangeQueueInfo> {
		const folder = await this.byID(req.query.id);
		return await this.ioService.renameFolder(folder.id, req.query.name, folder.rootID);
	}

	async artistInfo(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const folder = await this.byID(req.query.id);
		return {info: await this.metadataService.getFolderArtistInfo(folder)};
	}

	async artistSimilar(req: JamRequest<JamParameters.Folder>): Promise<Array<Jam.Folder>> {
		const folder = await this.byID(req.query.id);
		const list = await this.metadataService.getSimilarArtistFolders(folder);
		return this.prepareList(list, req.query, req.user);
	}

	async albumInfo(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const folder = await this.byID(req.query.id);
		return {info: await this.metadataService.getFolderAlbumInfo(folder)};
	}

	async artistSimilarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const folder = await this.byID(req.query.id);
		const tracks = await this.metadataService.getFolderSimilarTracks(folder);
		return this.trackController.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: JamRequest<JamParameters.FolderList>): Promise<Array<Jam.Folder>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async index(req: JamRequest<JamParameters.FolderSearch>): Promise<Jam.FolderIndex> {
		return formatFolderIndex(await this.indexService.getFolderIndex(await this.translateQuery(req.query, req.user)));
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

	async artworkUpdate(req: JamRequest<JamParameters.FolderArtworkUpdate>): Promise<Jam.ArtworkImage> {
		const {folder, artwork} = await this.artworkByID(req.query.id);
		const result = await this.folderService.updateArtworkImage(folder, artwork, req.query.name);
		return formatFolderArtwork(result);
	}

	async artworkDelete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const {folder, artwork} = await this.artworkByID(req.query.id);
		return await this.folderService.removeArtworkImage(folder, artwork);
	}

	async health(req: JamRequest<JamParameters.FolderHealth>): Promise<Array<Jam.FolderHealth>> {
		let list = await this.service.store.search(await this.translateQuery(req.query, req.user));
		list = list.sort((a, b) => {
			return a.path.localeCompare(b.path);
		});
		const result: Array<Jam.FolderHealth> = [];
		const roots: Array<Root> = [];
		const cachedFolders = list.slice(0);
		for (const folder of list) {
			let root = roots.find(r => r.id === folder.rootID);
			if (!root) {
				root = await this.rootService.rootStore.byId(folder.rootID);
				if (root) {
					roots.push(root);
				}
			}
			if (root) {
				const parents = await this.folderService.collectFolderPath(folder.parentID, cachedFolders);
				const health = await this.checker.run(folder, parents, root);
				if (health && health.length > 0) {
					result.push({
						folder: await this.prepare(folder, req.query, req.user),
						health
					});
				}
			}

		}
		return result;
	}

	async parentUpdate(req: JamRequest<JamParameters.FolderMoveParent>): Promise<Jam.AdminChangeQueueInfo> {
		const destFolder = await this.folderService.store.byId(req.query.folderID);
		if (!destFolder) {
			return Promise.reject(NotFoundError());
		}
		return this.ioService.moveFolders(req.query.ids, destFolder.id, destFolder.rootID);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<Jam.AdminChangeQueueInfo> {
		const folder = await this.byID(req.query.id);
		if (folder.tag.level === 0) {
			return Promise.reject(Error('Root folder cannot be deleted'));
		}
		return this.ioService.deleteFolder(folder.id, folder.rootID);
	}

	async create(req: JamRequest<JamParameters.FolderCreate>): Promise<Jam.Folder> {
		const folder = await this.byID(req.query.id);
		const newFolder = await this.folderService.newFolder(folder, req.query.name);
		return this.prepare(newFolder, {}, req.user);
	}
}
