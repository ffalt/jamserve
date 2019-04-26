import path from 'path';
import {ArtistIndex, ArtistIndexEntry, FolderIndex, FolderIndexEntry, AlbumIndex, AlbumIndexEntry} from './index.model';
import {Folder} from '../../objects/folder/folder.model';
import {ArtistStore, SearchQueryArtist} from '../../objects/artist/artist.store';
import {FolderStore, SearchQueryFolder} from '../../objects/folder/folder.store';
import {TrackStore} from '../../objects/track/track.store';
import {AlbumType} from '../../model/jam-types';
import {DebouncePromises} from '../../utils/debounce-promises';
import Logger from '../../utils/logger';
import {Jam} from '../../model/jam-rest-data';
import {AlbumStore, SearchQueryAlbum} from '../../objects/album/album.store';

const log = Logger('IndexService');

export class IndexTreeBuilder {
	private ignore: string;

	constructor(indexConfig: Jam.AdminSettingsIndex) {
		this.ignore = indexConfig.ignoreArticles.join('|');
	}

	removeArticles(name: string): string {
		// /^(?:(?:the|los|les)\s+)?(.*)/gi
		const matches = new RegExp('^(?:(?:' + this.ignore + ')\\s+)?(.*)', 'gi').exec(name);
		return matches ? matches[1] : name;
	}

	getIndexChar(name: string, sortname?: string): string {
		const s = (sortname || this.removeArticles(name) || '').replace(/¿…‘“«/g, '');
		const c = s.trim().charAt(0).toUpperCase();
		const regex_symbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#\d]/;
		if (c.match(regex_symbols) === null) {
			return c;
		}
		// if (!isNaN(Number(c))) {
		// 	return '№';
		// }
		return '#';
	}
}

export class IndexFolderTreeBuilder extends IndexTreeBuilder {
	constructor(indexConfig: Jam.AdminSettingsIndex, private folderStore: FolderStore, private trackStore: TrackStore) {
		super(indexConfig);
	}

	private async getTotalTrackCount(folder: Folder): Promise<number> {
		return this.trackStore.searchCount({inPath: folder.path});
	}

	async buildFolderIndex(query: SearchQueryFolder): Promise<FolderIndex> {
		const result: FolderIndex = {groups: [], lastModified: Date.now()};
		const folders = await this.folderStore.search(query);
		for (const folder of folders) {
			const trackCount = await this.getTotalTrackCount(folder);
			const entry: FolderIndexEntry = {
				name: path.basename(folder.path),
				nameSort: folder.tag.artistSort || this.removeArticles(path.basename(folder.path)),
				trackCount: trackCount || 0,
				folder
			};
			const indexChar = this.getIndexChar(entry.name, entry.nameSort);
			let group = result.groups.find(g => g.name === indexChar);
			if (!group) {
				group = {name: indexChar, entries: []};
				result.groups.push(group);
			}
			group.entries.push(entry);
		}
		result.groups.forEach(group => {
			group.entries.sort((a, b) => {
				return a.nameSort.localeCompare(b.nameSort);
			});
		});
		result.groups.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		return result;
	}
}

export class IndexArtistTreeBuilder extends IndexTreeBuilder {
	constructor(indexConfig: Jam.AdminSettingsIndex, private artistStore: ArtistStore) {
		super(indexConfig);
	}

	async buildArtistIndex(query: SearchQueryArtist): Promise<ArtistIndex> {
		const result: ArtistIndex = {groups: [], lastModified: Date.now()};
		const artists = await this.artistStore.search(query);
		artists.forEach(artist => {
			const entry: ArtistIndexEntry = {artist};
			const indexChar = this.getIndexChar(artist.name, artist.nameSort);
			let group = result.groups.find(g => g.name === indexChar);
			if (!group) {
				group = {name: indexChar, entries: []};
				result.groups.push(group);
			}
			group.entries.push(entry);
		});
		result.groups.forEach(group => {
			group.entries = group.entries.sort((a, b) => {
				return (a.artist.nameSort || this.removeArticles(a.artist.name)).localeCompare(b.artist.nameSort || this.removeArticles(b.artist.name));
			});
		});
		result.groups = result.groups.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		return result;
	}

}

export class IndexAlbumTreeBuilder extends IndexTreeBuilder {
	constructor(indexConfig: Jam.AdminSettingsIndex, private albumStore: AlbumStore) {
		super(indexConfig);
	}

	async buildAlbumIndex(query: SearchQueryAlbum): Promise<AlbumIndex> {
		const result: AlbumIndex = {groups: [], lastModified: Date.now()};
		const albums = await this.albumStore.search(query);
		albums.forEach(album => {
			const entry: AlbumIndexEntry = {album};
			const indexChar = this.getIndexChar(album.name);
			let group = result.groups.find(g => g.name === indexChar);
			if (!group) {
				group = {name: indexChar, entries: []};
				result.groups.push(group);
			}
			group.entries.push(entry);
		});
		result.groups.forEach(group => {
			group.entries.sort((a, b) => {
				return a.album.name.localeCompare(b.album.name);
			});
		});
		result.groups.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		return result;
	}

}

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

	public clearCache() {
		this.cached = {
			folder: {},
			artist: {},
			album: {}
		};
	}

	public setSettings(indexConfig: Jam.AdminSettingsIndex) {
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
			return result;
		} catch (e) {
			await this.indexCacheAlbumDebounce.reject(id, e);
			return Promise.reject(e);
		}
	}

	async buildDefaultIndexes() {
		this.clearCache();
		await this.getFolderIndex({level: 1});
		await this.getArtistIndex({albumType: AlbumType.album});
	}
}
