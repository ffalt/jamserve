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

export function buildMetaStat(dir: MatchDir, settings: Jam.AdminSettingsLibrary, strategy: RootScanStrategy): MetaStat {
	const stats: {
		[name: string]: { [key: string]: { count: number, val: string }; };
		artist: { [key: string]: { count: number, val: string }; };
		artistSort: { [key: string]: { count: number, val: string }; };
		album: { [key: string]: { count: number, val: string }; };
		genre: { [key: string]: { count: number, val: string }; };
		mbArtistID: { [key: string]: { count: number, val: string }; };
		mbAlbumID: { [key: string]: { count: number, val: string }; };
		mbReleaseGroupID: { [key: string]: { count: number, val: string }; };
		mbAlbumType: { [key: string]: { count: number, val: string }; };
		year: { [key: string]: { count: number, val: string }; };
		albumTrackCount: { [key: string]: { count: number, val: string }; };
	} = {
		artist: {},
		artistSort: {},
		album: {},
		genre: {},
		year: {},
		albumTrackCount: {},
		mbArtistID: {},
		mbReleaseGroupID: {},
		mbAlbumID: {},
		mbAlbumType: {}
	};
	let trackCount = 0;

	function statID(name: string, val?: string) {
		if (val && val.trim().length > 0) {
			const slug = val.split(' ')[0];
			stats[name][slug] = stats[name][val] || {count: 0, val: slug};
			stats[name][slug].count += 1;
		}
	}

	function statNumber(name: string, val?: number) {
		if (val !== undefined) {
			const slug = val.toString();
			stats[name][slug] = stats[name][slug] || {count: 0, val: val};
			stats[name][slug].count += 1;
		}
	}

	function statSlugValue(name: string, val?: string) {
		if (val && val.trim().length > 0) {
			const slug = slugify(val);
			stats[name][slug] = stats[name][slug] || {count: 0, val: val};
			stats[name][slug].count += 1;
		}
	}

	function statTrackCount(name: string, trackTotal?: number, disc?: number) {
		if (trackTotal !== undefined) {
			const slug = (disc !== undefined ? disc : 1).toString() + '-' + trackTotal.toString();
			stats[name][slug] = stats[name][slug] || {count: 0, val: trackTotal};
			stats[name][slug].count += 1;
		}
	}

	for (const file of dir.files) {
		if (file.type === FileTyp.AUDIO) {
			trackCount++;
			if (file.track && file.track.tag) {
				const tracktag = file.track.tag;
				statSlugValue('artist', tracktag.albumArtist || tracktag.artist);
				statSlugValue('artistSort', tracktag.albumArtistSort || tracktag.artistSort);
				statSlugValue('genre', tracktag.genre);
				statSlugValue('album', tracktag.album ? extractAlbumName(tracktag.album) : undefined);
				statNumber('year', tracktag.year);
				statTrackCount('albumTrackCount', tracktag.trackTotal, tracktag.disc);
				statSlugValue('mbAlbumType', tracktag.mbAlbumType);
				statID('mbArtistID', tracktag.mbArtistID);
				statID('mbAlbumID', tracktag.mbAlbumID);
				statID('mbReleaseGroupID', tracktag.mbReleaseGroupID);
			}
		}
	}
	let albumTrackCount = 0;
	if (stats.albumTrackCount) {
		const albumTrackCounts = convert2Numlist(stats.albumTrackCount);
		for (const atcount of albumTrackCounts) {
			albumTrackCount += atcount.val;
		}
	}
	for (const sub of dir.directories) {
		if (sub.folder && sub.tag && (sub.tag.type !== FolderType.extras)) {
			const subtag = sub.tag;
			statSlugValue('artist', subtag.artist);
			statSlugValue('artistSort', subtag.artistSort);
			statSlugValue('album', subtag.album ? extractAlbumName(subtag.album) : undefined);
			statSlugValue('genre', subtag.genre);
			statNumber('year', subtag.year);
			statSlugValue('mbAlbumType', subtag.mbAlbumType);
			statID('mbArtistID', subtag.mbArtistID);
			statID('mbAlbumID', subtag.mbAlbumID);
			statID('mbReleaseGroupID', subtag.mbReleaseGroupID);
			if (subtag.albumTrackCount !== undefined) {
				albumTrackCount += subtag.albumTrackCount;
			}
		}
	}

	// to easy to process lists
	const artists = convert2list(stats.artist);
	const artistSorts = convert2list(stats.artistSort);
	const albums = convert2list(stats.album);
	const genres = convert2list(stats.genre);
	const years = convert2Numlist(stats.year);
	const mbArtistIDs = convert2list(stats.mbArtistID);
	const mbAlbumIDs = convert2list(stats.mbAlbumID);
	const mbReleaseGroupIDs = convert2list(stats.mbReleaseGroupID);
	const mbAlbumTypes = convert2list(stats.mbAlbumType);

	// heuristically most used values
	const album = getMostUsedTagValue<string>(albums, extractAlbumName(path.basename(dir.name)));
	const artist = getMostUsedTagValue<string>(artists, MusicBrainz_VARIOUS_ARTISTS_NAME);
	let artistSort = getMostUsedTagValue<string>(artistSorts);
	const genre = getMostUsedTagValue<string>(genres);
	const mbAlbumID = getMostUsedTagValue<string>(mbAlbumIDs, '');
	const mbReleaseGroupID = getMostUsedTagValue<string>(mbReleaseGroupIDs, '');
	const mbAlbumType = getMostUsedTagValue<string>(mbAlbumTypes, '');
	const mbArtistID = getMostUsedTagValue<string>(mbArtistIDs, '');
	const year = getMostUsedTagValue<number>(years);
	// determinate album type
	const hasMultipleArtists = artist === MusicBrainz_VARIOUS_ARTISTS_NAME;
	const hasMultipleAlbums = albums.length > 1;
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
		album,
		artist,
		artistSort,
		genre,
		mbAlbumID,
		mbReleaseGroupID,
		mbAlbumType,
		mbArtistID,
		year,
		albumTrackCount: albumTrackCount > 0 ? albumTrackCount : undefined
	};
}
