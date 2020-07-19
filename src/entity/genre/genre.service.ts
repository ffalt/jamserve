import {Genre, GenreIndex} from './genre.model';
import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {IndexResultGroup} from '../base/base';

export interface GenreInfo {
	name: string;
	sections: Array<{
		rootID: string;
		trackCount: number;
		artistCount: number;
		albumCount: number;
		seriesCount: number;
		folderCount: number;
	}>;
}

@Singleton
export class GenreService {
	@Inject
	private orm!: OrmService;
	private genres: Array<GenreInfo> = [];

	async refresh(): Promise<void> {
		const genreHash: {
			[name: string]: {
				roots: {
					[id: string]: {
						count: number;
						artists: { [name: string]: number };
						albums: { [name: string]: number };
						series: { [name: string]: number };
						folders: { [name: string]: number };
					};
				};
			};
		} = {};

		// TODO better: distinct genres & request filtered counts
		const trackIDs = await this.orm.Track.findIDs({});
		for (const id of trackIDs) {
			const track = await this.orm.Track.oneOrFail(id);
			await this.orm.Track.populate(track, 'tag');
			let genres = track.tag?.genres;
			if (!genres || genres.length === 0) {
				genres = ['[No genre]']
			}
			for (const genre of genres) {
				const data = genreHash[genre] || {roots: {}};
				const section = data.roots[track.root.id] || {count: 0, artists: {}, albums: {}, series: {}, folders: {}};
				section.count++;
				if (track.artist?.id) {
					section.artists[track.artist.id] = (section.artists[track.artist.id] || 0) + 1;
				}
				if (track.album?.id) {
					section.albums[track.album.id] = (section.albums[track.album.id] || 0) + 1;
				}
				if (track.series?.id) {
					section.series[track.series.id] = (section.series[track.series.id] || 0) + 1;
				}
				if (track.folder?.id) {
					section.folders[track.folder.id] = (section.folders[track.folder.id] || 0) + 1;
				}
				data.roots[track.root.id] = section;
				genreHash[genre] = data;
			}
		}

		this.genres = Object.keys(genreHash).map(key => {
			const data = genreHash[key];
			return {
				name: key,
				sections: Object.keys(data.roots).map(sec => {
					const section = data.roots[sec];
					return {
						rootID: sec,
						artistCount: Object.keys(section.artists).length,
						albumCount: Object.keys(section.albums).length,
						seriesCount: Object.keys(section.series).length,
						folderCount: Object.keys(section.folders).length,
						trackCount: section.count
					};
				})
			};
		});
	}

	async getGenres(rootID?: string): Promise<Array<Genre>> {
		if (this.genres.length === 0) {
			await this.refresh();
		}
		return this.genres.map(g => {
			const genre = {
				name: g.name,
				albumCount: 0,
				artistCount: 0,
				trackCount: 0,
				seriesCount: 0,
				folderCount: 0
			};
			g.sections.forEach(section => {
				if (!rootID || section.rootID === rootID) {
					genre.albumCount += section.albumCount;
					genre.artistCount += section.artistCount;
					genre.trackCount += section.trackCount;
					genre.seriesCount += section.seriesCount;
					genre.folderCount += section.folderCount;
				}
			});
			return genre;
		}).filter(genre => genre.trackCount > 0).sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	}

	async index(): Promise<GenreIndex> {
		const genres = await this.getGenres();
		const map = new Map<string, Array<Genre>>();
		for (const entry of genres) {
			const char = entry.name[0] || '?';
			const list = map.get(char) || [];
			list.push(entry);
			map.set(char, list);
		}
		const groups: Array<IndexResultGroup<Genre>> = [];
		for (const [group, value] of map) {
			groups.push({
				name: group,
				items: value
			});
		}
		return {lastModified: Date.now(), groups};
	}
}
