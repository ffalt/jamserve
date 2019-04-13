import {AlbumType, FileTyp, FolderType, MusicBrainz_VARIOUS_ARTISTS_NAME, RootScanStrategy} from '../../model/jam-types';
import path from 'path';
import {Jam} from '../../model/jam-rest-data';
import {extractAlbumName, slugify} from './scan.utils';
import {MatchDir} from './scan.match-dir';

export interface MetaStatValue<T> {
	count: number;
	val: T;
}

export interface MetaStatString extends MetaStatValue<string> {
}

export interface MetaStatNumber extends MetaStatValue<number> {
}

export interface MetaStat {
	artist?: string;
	artistSort?: string;
	album?: string;
	genre?: string;
	mbArtistID?: string;
	mbAlbumID?: string;
	mbReleaseGroupID?: string;
	mbAlbumType?: string;
	year?: number;
	hasMultipleArtists: boolean;
	hasMultipleAlbums: boolean;
	albumTrackCount?: number;
	trackCount: number;
	albumType: AlbumType;
}

function convert2Numlist(o: { [key: string]: { count: number, val: string }; }): Array<MetaStatNumber> {
	return Object.keys(o).map(key => {
		return {count: o[key].count, val: Number(o[key].val)};
	}).sort((a, b) => {
		return a.count - b.count;
	});
}

function convert2list(o: { [key: string]: { count: number, val: string }; }): Array<MetaStatString> {
	return Object.keys(o).map(key => {
		return o[key];
	}).sort((a, b) => {
		return a.count - b.count;
	});
}

function getMostUsedTagValue<T>(list: Array<MetaStatValue<T>>, multi?: T): T | undefined {
	if (list.length === 0) {
		return undefined;
	}
	if (list.length === 1) {
		return list[0].val;
	}
	list = list.sort((a, b) => b.count - a.count);
	if (list[0].count - list[1].count > 4) {
		return list[0].val;
	}
	if (list.length > 3 && multi !== undefined) {
		return multi;
	}
	const cleaned = list.filter((o) => {
		return o.count > 1;
	});
	if (cleaned.length > 1 && multi !== undefined) {
		return multi;
	}
	if (cleaned.length > 0) {
		return cleaned[0].val;
	}
	if (multi !== undefined) {
		return multi;
	}
	return list[0].val;
}

export class MetaStatBuilder {
	stats: {
		[name: string]: { [key: string]: { count: number, val: string }; };
	} = {};

	statID(name: string, val?: string) {
		if (val && val.trim().length > 0) {
			const slug = val.split(' ')[0].trim();
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][val] || {count: 0, val: slug};
			this.stats[name][slug].count += 1;
		}
	}

	statNumber(name: string, val?: number) {
		if (val !== undefined) {
			const slug = val.toString();
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val: val};
			this.stats[name][slug].count += 1;
		}
	}

	statSlugValue(name: string, val?: string) {
		if (val && val.trim().length > 0) {
			const slug = slugify(val);
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val: val.trim()};
			this.stats[name][slug].count += 1;
		}
	}

	statTrackCount(name: string, trackTotal?: number, disc?: number) {
		if (trackTotal !== undefined) {
			const slug = (disc !== undefined ? disc : 1).toString() + '-' + trackTotal.toString();
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val: trackTotal};
			this.stats[name][slug].count += 1;
		}
	}

	asList(name: string): Array<MetaStatString> {
		return convert2list(this.stats[name] || {});
	}

	asNumberList(name: string): Array<MetaStatNumber> {
		return convert2Numlist(this.stats[name] || {});
	}

	mostUsed(name: string, multi?: string): undefined | string {
		const list = this.asList(name);
		return getMostUsedTagValue<string>(list, multi);
	}

	mostUsedNumber(name: string): undefined | number {
		const list = this.asNumberList(name);
		return getMostUsedTagValue<number>(list);
	}

}

export function buildMetaStat(dir: MatchDir, settings: Jam.AdminSettingsLibrary, strategy: RootScanStrategy): MetaStat {
	let trackCount = 0;

	const builder = new MetaStatBuilder();

	for (const file of dir.files) {
		if (file.type === FileTyp.AUDIO) {
			trackCount++;
			if (file.track && file.track.tag) {
				const tracktag = file.track.tag;
				builder.statSlugValue('artist', tracktag.albumArtist || tracktag.artist);
				builder.statSlugValue('artistSort', tracktag.albumArtistSort || tracktag.artistSort);
				builder.statSlugValue('genre', tracktag.genre);
				builder.statSlugValue('album', tracktag.album ? extractAlbumName(tracktag.album) : undefined);
				builder.statNumber('year', tracktag.year);
				builder.statTrackCount('albumTrackCount', tracktag.trackTotal, tracktag.disc);
				builder.statSlugValue('mbAlbumType', tracktag.mbAlbumType);
				builder.statID('mbArtistID', tracktag.mbArtistID);
				builder.statID('mbAlbumID', tracktag.mbAlbumID);
				builder.statID('mbReleaseGroupID', tracktag.mbReleaseGroupID);
			}
		}
	}
	let albumTrackCount = 0;
	const albumTrackCounts = builder.asNumberList('albumTrackCount');
	for (const atcount of albumTrackCounts) {
		albumTrackCount += atcount.val;
	}
	for (const sub of dir.directories) {
		if (sub.folder && sub.tag && (sub.tag.type !== FolderType.extras)) {
			const subtag = sub.tag;
			builder.statSlugValue('artist', subtag.artist);
			builder.statSlugValue('artistSort', subtag.artistSort);
			builder.statSlugValue('album', subtag.album ? extractAlbumName(subtag.album) : undefined);
			builder.statSlugValue('genre', subtag.genre);
			builder.statNumber('year', subtag.year);
			builder.statSlugValue('mbAlbumType', subtag.mbAlbumType);
			builder.statID('mbArtistID', subtag.mbArtistID);
			builder.statID('mbAlbumID', subtag.mbAlbumID);
			builder.statID('mbReleaseGroupID', subtag.mbReleaseGroupID);
			if (subtag.albumTrackCount !== undefined) {
				albumTrackCount += subtag.albumTrackCount;
			}
		}
	}

	// heuristically most used values
	const artist = builder.mostUsed('artist', MusicBrainz_VARIOUS_ARTISTS_NAME);
	let artistSort = builder.mostUsed('artistSort');
	const genre = builder.mostUsed('genre');
	const mbAlbumType = builder.mostUsed('mbAlbumType', '');
	// determinate album type
	const hasMultipleArtists = artist === MusicBrainz_VARIOUS_ARTISTS_NAME;
	const hasMultipleAlbums = builder.asList('album').length > 1;
	if (hasMultipleArtists) {
		artistSort = undefined;
	}
	let albumType = AlbumType.unknown;
	if (mbAlbumType) {
		const t = mbAlbumType.toLowerCase();
		if (t.indexOf('audiobook') >= 0) {
			albumType = AlbumType.audiobook;
		} else if (t.indexOf('compilation') >= 0) {
			albumType = AlbumType.compilation;
		} else if (t.indexOf('album') >= 0) {
			albumType = AlbumType.album;
		}
	}
	if (genre && albumType === AlbumType.unknown) {
		const g = genre.toLowerCase();
		const audioBook = settings.audioBookGenreNames.find(a => a.toLowerCase().localeCompare(g) === 0);
		if (audioBook) {
			albumType = AlbumType.audiobook;
		}
	}
	if (albumType === AlbumType.unknown) {
		if (strategy === RootScanStrategy.audiobook) {
			albumType = AlbumType.audiobook;
		} else if (strategy === RootScanStrategy.compilation) {
			albumType = AlbumType.compilation;
		} else if (strategy === RootScanStrategy.artistalbum) {
			albumType = AlbumType.album;
		} else {
			if (hasMultipleArtists) {
				albumType = AlbumType.compilation;
			} else {
				albumType = AlbumType.album;
			}
		}
	}

	return {
		trackCount,
		albumType,
		hasMultipleArtists,
		hasMultipleAlbums,
		album: builder.mostUsed('album', extractAlbumName(path.basename(dir.name))),
		artist,
		artistSort,
		genre,
		mbAlbumID: builder.mostUsed('mbAlbumID', ''),
		mbReleaseGroupID: builder.mostUsed('mbReleaseGroupID', ''),
		mbAlbumType,
		mbArtistID: builder.mostUsed('mbArtistID', ''),
		year: builder.mostUsedNumber('year'),
		albumTrackCount: albumTrackCount > 0 ? albumTrackCount : undefined
	};
}
