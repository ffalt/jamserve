import {Jam} from '../../model/jam-rest-data';
import {AlbumType} from '../../model/jam-types';
import {DebouncePromises} from '../../utils/debounce-promises';
import {AlbumStore, SearchQueryAlbum} from '../album/album.store';
import {ArtistStore, SearchQueryArtist} from '../artist/artist.store';
import {FolderStore, SearchQueryFolder} from '../folder/folder.store';
import {SearchQuerySeries, SeriesStore} from '../series/series.store';
import {TrackStore} from '../track/track.store';
import {IndexAlbumTreeBuilder, IndexArtistTreeBuilder, IndexFolderTreeBuilder, IndexSeriesTreeBuilder} from './index.builder';
import {AlbumIndex, ArtistIndex, FolderIndex, SeriesIndex} from './index.model';

export class IndexService {
	private cached: {
		folder: {
			[id: string]: FolderIndex;
		};
		artist: {
			[id: string]: ArtistIndex;
		};
		series: {
			[id: string]: SeriesIndex;
		};
		album: {
			[id: string]: AlbumIndex;
		};
	} = {
		folder: {},
		artist: {},
		series: {},
		album: {}
	};
	private indexCacheFolderDebounce = new DebouncePromises<FolderIndex>();
	private indexCacheArtistDebounce = new DebouncePromises<ArtistIndex>();
	private indexCacheSeriesDebounce = new DebouncePromises<SeriesIndex>();
	private indexCacheAlbumDebounce = new DebouncePromises<AlbumIndex>();
	public indexConfig: Jam.AdminSettingsIndex = {ignoreArticles: []};

	constructor(
		private artistStore: ArtistStore, private albumStore: AlbumStore,
		private folderStore: FolderStore, private trackStore: TrackStore,
		private seriesStore: SeriesStore
	) {
	}

	public clearCache(): void {
		this.cached = {
			folder: {},
			artist: {},
			series: {},
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
			this.indexCacheFolderDebounce.resolve(id, result);
			this.cached.folder[id] = result;
			return result;
		} catch (e) {
			this.indexCacheFolderDebounce.reject(id, e);
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
			this.indexCacheArtistDebounce.resolve(id, result);
			this.cached.artist[id] = result;
			return result;
		} catch (e) {
			this.indexCacheArtistDebounce.reject(id, e);
			return Promise.reject(e);
		}
	}

	async getSeriesIndex(query: SearchQuerySeries): Promise<SeriesIndex> {
		const id = JSON.stringify(query);
		if (this.cached.series[id]) {
			return this.cached.series[id];
		}
		if (this.indexCacheSeriesDebounce.isPending(id)) {
			return this.indexCacheSeriesDebounce.append(id);
		}
		this.indexCacheSeriesDebounce.setPending(id);
		try {
			const builder = new IndexSeriesTreeBuilder(this.indexConfig, this.seriesStore);
			const result = await builder.buildSeriesIndex(query);
			this.indexCacheSeriesDebounce.resolve(id, result);
			this.cached.series[id] = result;
			return result;
		} catch (e) {
			this.indexCacheSeriesDebounce.reject(id, e);
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
			this.indexCacheAlbumDebounce.resolve(id, result);
			this.cached.album[id] = result;
			return result;
		} catch (e) {
			this.indexCacheAlbumDebounce.reject(id, e);
			return Promise.reject(e);
		}
	}

	async buildDefaultIndexes(): Promise<void> {
		this.clearCache();
		await this.getFolderIndex({level: 1});
		await this.getArtistIndex({albumType: AlbumType.album});
	}
}
