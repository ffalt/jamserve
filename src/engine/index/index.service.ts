import path from 'path';
import {Store} from '../store';
import {Config} from '../../config';
import {IoService} from '../io/io.service';
import {ArtistIndex, ArtistIndexEntry, FolderIndex, FolderIndexEntry, Indexes} from './index.model';
import {Folder} from '../folder/folder.model';

export class IndexTreeBuilder {
	private readonly store: Store;
	private ignore: string;

	constructor(config: Config, store: Store) {
		this.ignore = config.app.index.ignore.join('|');
		this.store = store;
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
		const artists = await this.store.artistStore.all();
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
		return this.store.trackStore.searchCount({inPath: folder.path});
	}

	async buildFolderIndex(): Promise<FolderIndex> {
		const result: FolderIndex = {groups: [], lastModified: Date.now()};
		const folders = await this.store.folderStore.search({level: 1});
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

	constructor(private config: Config, private store: Store, private io: IoService) {
	}

	async buildIndexes(): Promise<void> {
		const builder = new IndexTreeBuilder(this.config, this.store);
		this.cached = await builder.buildIndexes();
	}

	async getIndexes(forcerebuild: boolean): Promise<Indexes> {
		if (forcerebuild || !this.cached) {
			await this.buildIndexes();
		}
		return <Indexes>this.cached;
	}

	async getFolderIndex(): Promise<FolderIndex> {
		const indexes = await this.getIndexes(this.io.scanning);
		return indexes.folderIndex;
	}

	async getArtistIndex(): Promise<ArtistIndex> {
		const indexes = await this.getIndexes(this.io.scanning);
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
