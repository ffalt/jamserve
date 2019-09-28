import path from 'path';
import {Jam} from '../../../model/jam-rest-data';
import {AlbumType, FileTyp, FolderType, MUSICBRAINZ_VARIOUS_ARTISTS_NAME, RootScanStrategy} from '../../../model/jam-types';
import {extractAlbumName} from '../../../utils/album-name';
import {slugify} from '../../../utils/slug';
import {MatchDir} from './match-dir.types';

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
	trackCount: number;
	subFolderTrackCount?: number;
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
	const cleaned = list.filter(o => {
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

	statID(name: string, val?: string): void {
		if (val && val.trim().length > 0) {
			const slug = val.split(' ')[0].trim();
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][val] || {count: 0, val: slug};
			this.stats[name][slug].count += 1;
		}
	}

	statNumber(name: string, val?: number): void {
		if (val !== undefined) {
			const slug = val.toString();
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val};
			this.stats[name][slug].count += 1;
		}
	}

	statSlugValue(name: string, val?: string): void {
		if (val && val.trim().length > 0) {
			const slug = slugify(val);
			this.stats[name] = this.stats[name] || {};
			this.stats[name][slug] = this.stats[name][slug] || {count: 0, val: val.trim()};
			this.stats[name][slug].count += 1;
		}
	}

	statTrackCount(name: string, trackTotal?: number, disc?: number): void {
		if (trackTotal !== undefined) {
			const slug = `${(disc !== undefined ? disc : 1)}-${trackTotal}`;
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

const typeByGenreNames: { [name: string]: AlbumType } = {
	audiobook: AlbumType.audiobook,
	'audio theater': AlbumType.audiodrama,
	soundtrack: AlbumType.soundtrack
};

function getGenreAlbumType(genre: string): AlbumType {
	return typeByGenreNames[genre.toLowerCase()] || AlbumType.unknown;
}

function getMusicbrainzAlbumType(mbAlbumType: string): AlbumType {
	const t = mbAlbumType.toLowerCase();
	if (t.includes('audiobook') || t.includes('spokenword')) {
		return AlbumType.audiobook;
	}
	if (t.includes('bootleg')) {
		return AlbumType.bootleg;
	}
	if (t.includes('compilation')) {
		return AlbumType.compilation;
	}
	if (t.includes('live')) {
		return AlbumType.live;
	}
	if (t.includes('soundtrack')) {
		return AlbumType.soundtrack;
	}
	if (t.includes('audiodrama') || t.includes('audio drama')) {
		return AlbumType.audiodrama;
	}
	if (t.includes('ep')) {
		return AlbumType.ep;
	}
	if (t.includes('single')) {
		return AlbumType.single;
	}
	if (t.includes('album')) {
		return AlbumType.album;
	}
	return AlbumType.unknown;
}

function getStrategyAlbumType(strategy: RootScanStrategy, hasMultipleArtists: boolean): AlbumType {
	switch (strategy) {
		case RootScanStrategy.auto:
			if (hasMultipleArtists) {
				return AlbumType.compilation;
			}
			return AlbumType.album;
		case RootScanStrategy.artistalbum:
			return AlbumType.album;
		case RootScanStrategy.compilation:
			return AlbumType.compilation;
		case RootScanStrategy.audiobook:
			return AlbumType.audiobook;
		default:
			return AlbumType.unknown;
	}
}

function buildTrackSlugs(dir: MatchDir, builder: MetaStatBuilder): number {
	let trackCount = 0;
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
				builder.statSlugValue('mbAlbumType', `${tracktag.mbAlbumType || ''}/${tracktag.mbAlbumStatus || ''}`);
				builder.statID('mbArtistID', tracktag.mbArtistID);
				builder.statID('mbAlbumID', tracktag.mbAlbumID);
				builder.statID('mbReleaseGroupID', tracktag.mbReleaseGroupID);
			}
		}
	}
	return trackCount;
}

function buildSubfolderSlugs(dir: MatchDir, builder: MetaStatBuilder): number {
	let subfolderTrackCount = 0;
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
				subfolderTrackCount += subtag.albumTrackCount;
			}
		}
	}
	return subfolderTrackCount;
}

export function buildMetaStat(dir: MatchDir, settings: Jam.AdminSettingsLibrary, strategy: RootScanStrategy): MetaStat {
	const builder = new MetaStatBuilder();
	const trackCount = buildTrackSlugs(dir, builder);
	const subfolderTrackCount = buildSubfolderSlugs(dir, builder);
	// heuristically most used values
	const artist = builder.mostUsed('artist', MUSICBRAINZ_VARIOUS_ARTISTS_NAME);
	let artistSort = builder.mostUsed('artistSort');
	const genre = builder.mostUsed('genre');
	const mbAlbumType = builder.mostUsed('mbAlbumType', '');
	// determinate album type
	const hasMultipleArtists = artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME;
	const hasMultipleAlbums = builder.asList('album').length > 1;
	if (hasMultipleArtists) {
		artistSort = undefined;
	}
	let albumType = AlbumType.unknown;
	if (genre) {
		albumType = getGenreAlbumType(genre);
	}
	if (mbAlbumType && albumType === AlbumType.unknown) {
		albumType = getMusicbrainzAlbumType(mbAlbumType);
	}
	if (albumType === AlbumType.unknown) {
		albumType = getStrategyAlbumType(strategy, hasMultipleArtists);
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
		subFolderTrackCount: subfolderTrackCount > 0 ? subfolderTrackCount : undefined
	};
}
