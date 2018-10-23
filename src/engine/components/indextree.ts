import {JamServe} from '../../model/jamserve';
import path from 'path';
import {Store} from '../../store/store';
import {Config} from '../../config';

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

	async buildArtistIndex(): Promise<JamServe.ArtistIndex> {
		const result: JamServe.ArtistIndex = {groups: [], lastModified: Date.now()};
		const artists = await this.store.artist.all();
		artists.forEach(artist => {
			const entry: JamServe.ArtistIndexEntry = {artist};
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

	private async getTotalTrackCount(folder: JamServe.Folder): Promise<number> {
		return this.store.track.searchCount({inPath: folder.path});
	}

	async buildFolderIndex(): Promise<JamServe.FolderIndex> {
		const result: JamServe.FolderIndex = {groups: [], lastModified: Date.now()};
		const folders = await this.store.folder.search({level: 1});
		for (const folder of folders) {
			const trackCount = await this.getTotalTrackCount(folder);
			const entry: JamServe.FolderIndexEntry = {
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

	async buildIndexes(): Promise<JamServe.Indexes> {
		const folderIndex = await this.buildFolderIndex();
		const artistIndex = await this.buildArtistIndex();
		return {folderIndex, artistIndex};
	}
}

export class IndexTree {
	private readonly config: Config;
	private readonly store: Store;
	private cached?: JamServe.Indexes;

	constructor(config: Config, store: Store) {
		this.config = config;
		this.store = store;
	}

	async buildIndexes(): Promise<void> {
		const builder = new IndexTreeBuilder(this.config, this.store);
		this.cached = await builder.buildIndexes();
	}

	async getIndexes(forcerebuild: boolean): Promise<JamServe.Indexes> {
		if (forcerebuild || !this.cached) {
			await this.buildIndexes();
		}
		return <JamServe.Indexes>this.cached;
	}

	async getFolderIndex(forcerebuild: boolean): Promise<JamServe.FolderIndex> {
		const indexes = await this.getIndexes(forcerebuild);
		return indexes.folderIndex;
	}

	async getArtistIndex(forcerebuild: boolean): Promise<JamServe.ArtistIndex> {
		const indexes = await this.getIndexes(forcerebuild);
		return indexes.artistIndex;
	}

	filterFolderIndex(rootID: string | undefined, folderIndex: JamServe.FolderIndex): JamServe.FolderIndex {
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

	filterArtistIndex(rootID: string | undefined, artistIndex: JamServe.ArtistIndex): JamServe.ArtistIndex {
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
