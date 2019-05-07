import path from 'path';
import {AlbumType, cUnknownAlbum, cUnknownArtist, MUSICBRAINZ_VARIOUS_ARTISTS_NAME} from '../../model/jam-types';
import {deepCompare} from '../../utils/deep-compare';
import {md5string} from '../../utils/md5';
import {MatchDir, MatchFile} from './scan.match-dir';

export function slugify(s: string): string {
	return s.replace(/[\[\]\. -]/g, '').toLowerCase();
}

export function splitDirectoryName(name: string): { title: string; year?: number; } {
	const result: { title: string; year?: number; } = {title: path.basename(name).trim()};
	// year title | year - title | (year) title | [year] title
	const parts = result.title.split(' ');
	const s = parts[0].replace(/[^\w\s]/gi, '');
	if (s.length === 4) {
		const y = Number(s);
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

export function folderHasChanged(dir: MatchDir): boolean {
	return (!dir.folder) ||
		(dir.stat.mtime !== dir.folder.stat.modified) ||
		(dir.stat.ctime !== dir.folder.stat.created) ||
		(!deepCompare(dir.folder.tag, dir.tag));
}

export function trackHasChanged(file: MatchFile): boolean {
	return (!file.track) ||
		(file.stat.mtime !== file.track.stat.modified) ||
		(file.stat.ctime !== file.track.stat.created) ||
		(file.stat.size !== file.track.stat.size);
}

export function generateArtworkId(folderID: string, filename: string): string {
	const id = folderID + '-' + md5string(filename + filename);
	return id;
}

export function extractAlbumName(name: string): string {
	const result = name
		.replace(/\(((\d\d\d\d)|(\d* ?cds)|(cd ?\d*)|(disc ?\d*)|(disc ?\d*:.*)|(bonus.*)|(.*edition)|(.*retail)|(\d* of \d*)|(eps?|bootleg|deluxe|promo|single|lp|limited edition|retro|ost|uvs|demp|demos|remastered|remix|live|remixes|vinyl|collection|maxi|bonus disc))\)/gi, '')
		.replace(/\[((\d\d\d\d)|(\d* ?cds)|(cd ?\d*)|(disc ?\d*)|(disc ?\d*:.*)|(bonus.*)|(.*edition)|(.*retail)|(\d* of \d*)|(eps?|bootleg|deluxe|promo|single|lp|limited edition|retro|ost|uvs|demp|demos|remastered|remix|live|remixes|vinyl|collection|maxi|bonus disc))\]/gi, '')
		.replace(/-? cd\d*/gi, '')
		.trim();
	if (result.length === 0) {
		return name.trim();
	}
	return result;
}
