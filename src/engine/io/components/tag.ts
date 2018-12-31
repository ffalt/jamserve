import {MatchDir} from './match';
import {AlbumType, FileTyp, FolderType} from '../../../model/jam-types';
import path from 'path';
import Logger from '../../../utils/logger';
import {FolderTag} from '../../../objects/folder/folder.model';

const log = Logger('IO.tag');

export const cVariousArtist = '[Various Artists]';
export const cUnknownArtist = '[Unknown Artist]';
export const cUnknownAlbum = '[Unknown Album]';

interface MetaStatValue<T> {
	count: number;
	val: T;
}

interface MetaStatString extends MetaStatValue<string> {
}

interface MetaStatNumber extends MetaStatValue<number> {
}

interface MetaStat {
	artist?: string;
	artistSort?: string;
	album?: string;
	genre?: string;
	mbArtistID?: string;
	mbAlbumID?: string;
	year?: number;
	images: Array<string>;
	image?: string;
	isMultiArtist: boolean;
	isMultiAlbum: boolean;
	trackCount: number;
}

function convert2Numlist(o: { [key: string]: number; }): Array<MetaStatNumber> {
	return Object.keys(o).map(key => {
		return {count: o[key], val: parseInt(key, 10)};
	}).sort((a, b) => {
		return a.count - b.count;
	});
}

function convert2list(o: { [key: string]: number; }): Array<MetaStatString> {
	return Object.keys(o).map(key => {
		return {count: o[key], val: key};
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
	list = list.sort((a, b) => a.count - b.count);
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

function getMetaStat(dir: MatchDir): MetaStat {
	// combine meta frames from child tracks and folders
	const stats: {
		artist: { [key: string]: number; };
		artistSort: { [key: string]: number; };
		album: { [key: string]: number; };
		genre: { [key: string]: number; };
		mbArtistID: { [key: string]: number; };
		mbAlbumID: { [key: string]: number; };
		year: { [key: string]: number; };
	} = {
		artist: {},
		artistSort: {},
		album: {},
		genre: {},
		year: {},
		mbArtistID: {},
		mbAlbumID: {},
	};
	const images: Array<string> = [];
	let trackCount = 0;
	dir.files.forEach((file) => {
		if (file.type === FileTyp.AUDIO) {
			trackCount++;
		}
		if (file.track && file.track.tag) {
			const tracktag = file.track.tag;
			if (tracktag.artist) {
				stats.artist[tracktag.artist] = (stats.artist[tracktag.artist] || 0) + 1;
			}
			if (tracktag.artistSort) {
				stats.artistSort[tracktag.artistSort] = (stats.artistSort[tracktag.artistSort] || 0) + 1;
			}
			if (tracktag.album) {
				stats.album[tracktag.album] = (stats.album[tracktag.album] || 0) + 1;
			}
			if (tracktag.genre) {
				stats.genre[tracktag.genre] = (stats.genre[tracktag.genre] || 0) + 1;
			}
			if (tracktag.year) {
				stats.year[tracktag.year] = (stats.year[tracktag.year] || 0) + 1;
			}
			if (tracktag.mbArtistID) {
				const s = tracktag.mbArtistID.split(' ')[0];
				stats.mbArtistID[s] = (stats.mbArtistID[s] || 0) + 1;
			}
			if (tracktag.mbAlbumID) {
				const s = tracktag.mbAlbumID.split(' ')[0];
				stats.mbAlbumID[s] = (stats.mbAlbumID[s] || 0) + 1;
			}
		} else if (file.type === FileTyp.IMAGE) {
			images.push(file.name);
		}
	});
	dir.directories.forEach((sub) => {
		if (sub.folder && sub.tag) {
			const subtag = sub.tag;
			if (subtag.artist) {
				stats.artist[subtag.artist] = (stats.artist[subtag.artist] || 0) + 1;
			}
			if (subtag.artistSort) {
				stats.artistSort[subtag.artistSort] = (stats.artistSort[subtag.artistSort] || 0) + 1;
			}
			if (subtag.album) {
				stats.album[subtag.album] = (stats.album[subtag.album] || 0) + 1;
			}
			if (subtag.genre) {
				stats.genre[subtag.genre] = (stats.genre[subtag.genre] || 0) + 1;
			}
			if (subtag.year) {
				stats.year[subtag.year] = (stats.year[subtag.year] || 0) + 1;
			}
			if (subtag.mbArtistID) {
				const s = subtag.mbArtistID.split(' ')[0];
				stats.mbArtistID[s] = (stats.mbArtistID[s] || 0) + 1;
			}
			if (subtag.mbAlbumID) {
				const s = subtag.mbAlbumID.split(' ')[0];
				stats.mbAlbumID[s] = (stats.mbAlbumID[s] || 0) + 1;
			}
		}
	});
	const artists = convert2list(stats.artist);
	const artistSorts = convert2list(stats.artistSort);
	const albums = convert2list(stats.album);
	const genres = convert2list(stats.genre);
	const years = convert2Numlist(stats.year);
	const mbArtistIDs = convert2list(stats.mbArtistID);
	const mbAlbumIDs = convert2list(stats.mbAlbumID);
	const album = getMostUsedTagValue<string>(albums, path.basename(dir.name));
	const artist = getMostUsedTagValue<string>(artists, cVariousArtist);
	const artistSort = getMostUsedTagValue<string>(artistSorts);
	const genre = getMostUsedTagValue<string>(genres);
	const mbAlbumID = getMostUsedTagValue<string>(mbAlbumIDs);
	const mbArtistID = getMostUsedTagValue<string>(mbArtistIDs);
	const year = getMostUsedTagValue<number>(years);
	const isMultiArtist = artist === cVariousArtist;
	const isMultiAlbum = albums.length > 0;
	let image: string | undefined;
	// check folder image
	if (images.length > 0) {
		if (images.length === 1) {
			image = path.basename(images[0]);
		} else {
			images.forEach((img) => {
				const typ = path.basename(img, path.extname(img)).toLowerCase();
				if (['folder', 'cover', 'front'].indexOf(typ) >= 0) {
					image = path.basename(img);
				}
			});
			if (image === undefined) {
				image = path.basename(images[0]);
			}
		}
	}
	return {
		trackCount,
		images,
		image,
		isMultiArtist,
		isMultiAlbum,
		album,
		artist,
		artistSort,
		genre,
		mbAlbumID,
		mbArtistID,
		year
	};
}

function splitDirectoryName(name: string): { title: string; year?: number; } {
	const result: { title: string; year?: number; } = {title: path.basename(name).trim()};
	// year title | year - title | (year) title | [year] title
	const parts = result.title.split(' ');
	const s = parts[0].replace(/[^\w\s]/gi, '');
	if (s.length === 4) {
		const y = parseInt(s, 10);
		if (!isNaN(y)) {
			result.year = y;
			parts.shift();
			if (parts[0] === '-') {
				parts.shift();
			}
			result.title = parts.join(' ');
		}
	}
	return result;
}

function applyFolderTagType(dir: MatchDir) {
	if (!dir.tag) {
		return;
	}
	const metaStat = getMetaStat(dir);
	const name = path.basename(dir.name).toLowerCase();
	let result: FolderType = FolderType.unknown;
	if (dir.level === 0) {
		result = FolderType.multiartist;
	} else if (name.match(/\[(extra|various)\]/) || name.match(/^(extra|various)$/)) {
		result = FolderType.extras;
	} else if (metaStat.trackCount > 0) {
		const dirCount = dir.directories.filter(d => !!d.tag && d.tag.type !== FolderType.extras).length;
		if (dirCount === 0) {
			result = FolderType.album;
		} else {
			result = FolderType.multialbum;
		}
	} else {
		if (metaStat.isMultiArtist) {
			result = FolderType.multialbum;
		} else {
			result = FolderType.artist;
			dir.directories.forEach(d => {
				if (d.tag && d.tag.type === FolderType.artist) {
					d.tag.type = FolderType.multialbum;
				}
			});
		}
	}
	if (result === FolderType.multialbum) {
		const a = dir.directories.find(d => {
			return (!!d.tag && d.tag.type === FolderType.artist);
		});
		if (a) {
			result = FolderType.multiartist;
		}
	}
	dir.tag.type = result;
}

function createFolderTag(dir: MatchDir): FolderTag {
	log.debug('Generating folder tag ', dir.name);
	const metaStat = getMetaStat(dir);
	const nameSplit = splitDirectoryName(dir.name);
	const tag: FolderTag = {
		tracks: dir.files.filter(f => f.type === FileTyp.AUDIO).length,
		level: dir.level,
		type: FolderType.unknown,
		album: metaStat.album,
		albumType: metaStat.isMultiArtist ? AlbumType.mix : AlbumType.album,
		artist: metaStat.artist,
		artistSort: metaStat.artistSort,
		title: nameSplit.title,
		image: metaStat.image,
		genre: metaStat.genre,
		mbAlbumID: metaStat.mbAlbumID,
		mbArtistID: metaStat.mbArtistID,
		year: (nameSplit.year !== undefined) ? nameSplit.year : metaStat.year
	};
	return tag;
}

function createTagsR(dir: MatchDir) {
	dir.directories.forEach(createTagsR);
	if (dir.folder) {
		dir.tag = createFolderTag(dir);
	}
	applyFolderTagType(dir);
}

export function fillMatchTags(dir: MatchDir) {
	createTagsR(dir);
}
