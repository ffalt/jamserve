import path from 'path';
import {IndexConfig} from '../../config';
import {ArtistIndex, ArtistIndexEntry, FolderIndex, FolderIndexEntry, Indexes} from './index.model';
import {Folder} from '../../objects/folder/folder.model';
import {ArtistStore} from '../../objects/artist/artist.store';
import {FolderStore} from '../../objects/folder/folder.store';
import {TrackStore} from '../../objects/track/track.store';
import {AlbumType} from '../../model/jam-types';
import {DebouncePromises} from '../../utils/debounce-promises';
import {IApiBinaryResult} from '../../typings';
import fse from 'fs-extra';
import Logger from '../../utils/logger';

const log = Logger('IndexService');

export class IndexTreeBuilder {
	private ignore: string;

	constructor(indexConfig: IndexConfig, private artistStore: ArtistStore, private folderStore: FolderStore, private trackStore: TrackStore) {
		this.ignore = indexConfig.ignore.join('|');
	}

	removeArticles(name: string): string {
		// /^(?:(?:the|los|les)\s+)?(.*)/gi
		const matches = new RegExp('^(?:(?:' + this.ignore + ')\\s+)?(.*)', 'gi').exec(name);
		return matches ? matches[1] : name;
	}

	getIndexChar(name: string, sortname?: string): string {
		const c = (sortname || this.removeArticles(name) || '').trim().toUpperCase().charAt(0);
		const regex_symbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#\d]/;
		if (c.match(regex_symbols) === null) {
			return c;
		}
		return '#';
	}

	async buildArtistIndex(): Promise<ArtistIndex> {
		const result: ArtistIndex = {groups: [], lastModified: Date.now()};
		const artists = await this.artistStore.search({albumType: AlbumType.album});
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
			group.entries.sort((a, b) => {
				return a.artist.name.localeCompare(b.artist.name);
			});
		});
		result.groups.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		return result;
	}

	private async getTotalTrackCount(folder: Folder): Promise<number> {
		return this.trackStore.searchCount({inPath: folder.path});
	}

	async buildFolderIndex(): Promise<FolderIndex> {
		const result: FolderIndex = {groups: [], lastModified: Date.now()};
		const folders = await this.folderStore.search({level: 1});
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

	async buildIndexes(): Promise<Indexes> {
		const folderIndex = await this.buildFolderIndex();
		const artistIndex = await this.buildArtistIndex();
		return {folderIndex, artistIndex};
	}
}

export class IndexService {
	private cached?: Indexes;
	private indexCacheDebounce = new DebouncePromises<Indexes>();

	constructor(public indexConfig: IndexConfig, private artistStore: ArtistStore, private folderStore: FolderStore, private trackStore: TrackStore) {
	}

	async buildIndexes(): Promise<Indexes> {
		log.debug('Building Indexes');
		const builder = new IndexTreeBuilder(this.indexConfig, this.artistStore, this.folderStore, this.trackStore);
		this.cached = await builder.buildIndexes();
		return this.cached;
	}

	async getIndexes(): Promise<Indexes> {
		if (this.cached) {
			return this.cached;
		}
		const cacheID = 'index';
		if (this.indexCacheDebounce.isPending(cacheID)) {
			return this.indexCacheDebounce.append(cacheID);
		}
		this.indexCacheDebounce.setPending(cacheID);
		try {
			const result = await this.buildIndexes();
			await this.indexCacheDebounce.resolve(cacheID, result);
			return result;
		} catch (e) {
			await this.indexCacheDebounce.reject(cacheID, e);
			return Promise.reject(e);
		}
	}

	async getFolderIndex(): Promise<FolderIndex> {
		const indexes = await this.getIndexes();
		return indexes.folderIndex;
	}

	async getArtistIndex(): Promise<ArtistIndex> {
		const indexes = await this.getIndexes();
		return indexes.artistIndex;
	}

	filterFolderIndex(rootID: string | undefined, folderIndex: FolderIndex): FolderIndex {
		if (!rootID) {
			return folderIndex;
		}
		return {
			lastModified: folderIndex.lastModified,
			groups: folderIndex.groups.map(group => {
				return {
					name: group.name,
					entries: group.entries.filter(entry => entry.folder.rootID === rootID)
				};
			}).filter(group => group.entries.length > 0)
		};
	}

	filterArtistIndex(rootID: string | undefined, artistIndex: ArtistIndex): ArtistIndex {
		if (!rootID) {
			return artistIndex;
		}
		return {
			lastModified: artistIndex.lastModified,
			groups: artistIndex.groups.map(group => {
				return {
					name: group.name,
					entries: group.entries.filter(entry => entry.artist.rootIDs.indexOf(rootID) >= 0)
				};
			}).filter(group => group.entries.length > 0)
		};
	}

}
