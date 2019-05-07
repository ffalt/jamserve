import {Jam} from '../../model/jam-rest-data';
import {AlbumType} from '../../model/jam-types';
import {AlbumStore, SearchQueryAlbum} from '../../objects/album/album.store';
import {ArtistStore, SearchQueryArtist} from '../../objects/artist/artist.store';
import {FolderStore, SearchQueryFolder} from '../../objects/folder/folder.store';
import {TrackStore} from '../../objects/track/track.store';
import {DebouncePromises} from '../../utils/debounce-promises';
import {IndexAlbumTreeBuilder, IndexArtistTreeBuilder, IndexFolderTreeBuilder} from './index.builder';
import {AlbumIndex, ArtistIndex, FolderIndex} from './index.model';

export class IndexService {
	private cached: {
		folder: {
			[id: string]: FolderIndex;
		};
		artist: {
			[id: string]: ArtistIndex;
		};
		album: {
			[id: string]: AlbumIndex;
		};
	} = {
		folder: {},
		artist: {},
		album: {}
	};
	private indexCacheFolderDebounce = new DebouncePromises<FolderIndex>();
	private indexCacheArtistDebounce = new DebouncePromises<ArtistIndex>();
	private indexCacheAlbumDebounce = new DebouncePromises<AlbumIndex>();
	public indexConfig: Jam.AdminSettingsIndex = {ignoreArticles: []};

	constructor(private artistStore: ArtistStore, private albumStore: AlbumStore, private folderStore: FolderStore, private trackStore: TrackStore) {
	}

	public clearCache(): void {
		this.cached = {
			folder: {},
			artist: {},
			album: {}
		};
	}

	public setSettings(indexConfig: Jam.AdminSettingsIndex): void {
		this.indexConfig = indexConfig;
		this.clearCache();
	}

	async getFolderIndex(query: SearchQueryFolder): Promise<FolderIndex> {
		const id = JSON.stringify(query);
		if (this.cached.folder[id]) {
			return this.cached.folder[id];
		}
		if (this.indexCacheFolderDebounce.isPending(id)) {
			return this.indexCacheFolderDebounce.append(id);
		}
		this.indexCacheFolderDebounce.setPending(id);
		try {
			const builder = new IndexFolderTreeBuilder(this.indexConfig, this.folderStore, this.trackStore);
			const result = await builder.buildFolderIndex(query);
			await this.indexCacheFolderDebounce.resolve(id, result);
			this.cached.folder[id] = result;
			return result;
		} catch (e) {
			await this.indexCacheFolderDebounce.reject(id, e);
			return Promise.reject(e);
		}
	}

	async getArtistIndex(query: SearchQueryArtist): Promise<ArtistIndex> {
		const id = JSON.stringify(query);
		if (this.cached.artist[id]) {
			return this.cached.artist[id];
		}
		if (this.indexCacheArtistDebounce.isPending(id)) {
			return this.indexCacheArtistDebounce.append(id);
		}
		this.indexCacheArtistDebounce.setPending(id);
		try {
			const builder = new IndexArtistTreeBuilder(this.indexConfig, this.artistStore);
			const result = await builder.buildArtistIndex(query);
			await this.indexCacheArtistDebounce.resolve(id, result);
			this.cached.artist[id] = result;
			return result;
		} catch (e) {
			await this.indexCacheArtistDebounce.reject(id, e);
			return Promise.reject(e);
		}
	}

	async getAlbumIndex(query: SearchQueryAlbum): Promise<AlbumIndex> {
		const id = JSON.stringify(query);
		if (this.cached.album[id]) {
			return this.cached.album[id];
		}
		if (this.indexCacheAlbumDebounce.isPending(id)) {
			return this.indexCacheAlbumDebounce.append(id);
		}
		this.indexCacheAlbumDebounce.setPending(id);
		try {
			const builder = new IndexAlbumTreeBuilder(this.indexConfig, this.albumStore);
			const result = await builder.buildAlbumIndex(query);
			await this.indexCacheAlbumDebounce.resolve(id, result);
			this.cached.album[id] = result;
			return result;
		} catch (e) {
			await this.indexCacheAlbumDebounce.reject(id, e);
			return Promise.reject(e);
		}
	}

	async buildDefaultIndexes(): Promise<void> {
		this.clearCache();
		await this.getFolderIndex({level: 1});
		await this.getArtistIndex({albumType: AlbumType.album});
	}
}
