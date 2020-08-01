import {Genre, GenreIndex} from './genre.model';
import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
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

@InRequestScope
export class GenreService {
	private genres: Array<GenreInfo> = [];

	async refresh(orm: Orm): Promise<void> {
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
		const trackIDs = await orm.Track.findIDs({});
		for (const id of trackIDs) {
			const track = await orm.Track.oneOrFailByID(id);
			const tag = await track.tag.get();
			let genres = tag?.genres;
			if (!genres || genres.length === 0) {
				genres = ['[No genre]'];
			}
			for (const genre of genres) {
				const data = genreHash[genre] || {roots: {}};
				const rootID = track.root.idOrFail();
				const section = data.roots[rootID] || {count: 0, artists: {}, albums: {}, series: {}, folders: {}};
				section.count++;
				const artistID = track.artist.id();
				if (artistID) {
					section.artists[artistID] = (section.artists[artistID] || 0) + 1;
				}
				const albumID = await track.album.id();
				if (albumID) {
					section.albums[albumID] = (section.albums[albumID] || 0) + 1;
				}
				const seriesID = await track.series.id();
				if (seriesID) {
					section.series[seriesID] = (section.series[seriesID] || 0) + 1;
				}
				const folderID = await track.folder.id();
				if (folderID) {
					section.folders[folderID] = (section.folders[folderID] || 0) + 1;
				}
				data.roots[rootID] = section;
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

	async getGenres(orm: Orm, rootID?: string): Promise<Array<Genre>> {
		if (this.genres.length === 0) {
			await this.refresh(orm);
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

	async index(orm: Orm): Promise<GenreIndex> {
		const genres = await this.getGenres(orm);
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
