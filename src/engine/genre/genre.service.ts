import {TrackStore} from '../track/track.store';
import {Genre} from './genre.model';

export interface GenreInfo {
	name: string;
	sections: Array<{
		rootID: string;
		trackCount: number;
		artistCount: number;
		albumCount: number;
	}>;
}

export class GenreService {
	private genres: Array<GenreInfo> = [];

	constructor(private trackStore: TrackStore) {
	}

	async refresh(): Promise<void> {
		// logger.info('Build Genres');
		const genreHash: {
			[name: string]: {
				roots: {
					[id: string]: {
						count: number;
						artists: { [name: string]: number };
						albums: { [name: string]: number };
					}
				}
			}
		} = {};

		await this.trackStore.iterate(async tracks => {
			for (const track of tracks) {
				const genre = track.tag.genre || '[No genre]';
				const data = genreHash[genre] || {roots: {}};
				const section = data.roots[track.rootID] || {count: 0, artists: {}, albums: {}};
				section.count++;
				if (track.artistID) {
					section.artists[track.artistID] = (section.artists[track.artistID] || 0) + 1;
				}
				if (track.albumID) {
					section.albums[track.albumID] = (section.albums[track.albumID] || 0) + 1;
				}
				data.roots[track.rootID] = section;
				genreHash[genre] = data;
			}
		});

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
				trackCount: 0
			};
			g.sections.forEach(section => {
				if (!rootID || section.rootID === rootID) {
					genre.albumCount += section.albumCount;
					genre.artistCount += section.artistCount;
					genre.trackCount += section.trackCount;
				}
			});
			return genre;
		}).filter(genre => genre.trackCount > 0);
	}

}
