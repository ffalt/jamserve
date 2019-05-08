/* tslint:disable:max-classes-per-file */
import path from 'path';
import {Jam} from '../../model/jam-rest-data';
import {AlbumStore, SearchQueryAlbum} from '../album/album.store';
import {ArtistStore, SearchQueryArtist} from '../artist/artist.store';
import {Folder} from '../folder/folder.model';
import {FolderStore, SearchQueryFolder} from '../folder/folder.store';
import {TrackStore} from '../track/track.store';
import {AlbumIndex, AlbumIndexEntry, ArtistIndex, ArtistIndexEntry, FolderIndex, FolderIndexEntry} from './index.model';

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

	getIndexChar(name: string): string {
		const s = name.replace(/[¿…¡?[\]{}<>‘`“'&_~=:.\/;@#«!%$*()+\-\\|]/g, '').trim();
		if (s.length === 0) {
			return '#';
		}
		const c = s.charAt(0).toUpperCase();
		if (!isNaN(Number(c))) {
			return '#';
		}
		return c;
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
			const indexChar = this.getIndexChar(entry.nameSort);
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
			const indexChar = this.getIndexChar(artist.nameSort || this.removeArticles(artist.name) || '');
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
