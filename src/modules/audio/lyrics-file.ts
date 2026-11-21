import fse from 'fs-extra';
import path from 'node:path';
import { TrackLyrics } from '../../entity/track/track.model.js';
import { buildLyrics, hasLyricsTimestamps, LyricsTags, parseLyrics, plainLyrics } from '../../utils/lyrics-lrc.js';
import { basenameStripExtension } from '../../utils/fs-utils.js';
import { logger } from '../../utils/logger.js';

const log = logger('Lyrics:File');

export const LyricsSyncedExtensions = ['.lrc', '.elrc'];
export const LyricsPlainExtensions = ['.txt'];

export interface LyricsFileInfo {
	title?: string;
	artist?: string;
	album?: string;
	duration?: number;
}

export function lyricsSidecarCandidates(filename: string, extensions: Array<string> = [...LyricsSyncedExtensions, ...LyricsPlainExtensions]): Array<string> {
	const directory = path.dirname(filename);
	const base = basenameStripExtension(filename);
	const full = path.basename(filename);
	const result: Array<string> = [];
	for (const extension of extensions) {
		result.push(path.join(directory, `${base}${extension}`), path.join(directory, `${full}${extension}`));
	}
	return result;
}

export function lyricsFromText(text: string, source: string): TrackLyrics | undefined {
	const content = (text.startsWith('\u{FEFF}') ? text.slice(1) : text).trim();
	if (!content) {
		return;
	}
	if (hasLyricsTimestamps(content)) {
		return { syncedLyrics: content, lyrics: plainLyrics(content), source };
	}
	return { lyrics: content, source };
}

export async function readLyricsSidecar(filename: string): Promise<TrackLyrics | undefined> {
	for (const candidate of lyricsSidecarCandidates(filename)) {
		if (!await fse.pathExists(candidate)) {
			continue;
		}
		try {
			const lyrics = lyricsFromText(await fse.readFile(candidate, 'utf8'), 'file');
			if (lyrics) {
				return lyrics;
			}
		} catch (error: unknown) {
			log.errorMsg(`Could not read lyrics file ${candidate}`, error);
		}
	}
	return;
}

export async function hasSyncedLyricsSidecar(filename: string): Promise<boolean> {
	for (const candidate of lyricsSidecarCandidates(filename, LyricsSyncedExtensions)) {
		if (!await fse.pathExists(candidate)) {
			continue;
		}
		try {
			if (hasLyricsTimestamps(await fse.readFile(candidate, 'utf8'))) {
				return true;
			}
		} catch (error: unknown) {
			log.errorMsg(`Could not read lyrics file ${candidate}`, error);
		}
	}
	return false;
}

function formatLength(duration?: number): string | undefined {
	if (!duration || duration <= 0) {
		return;
	}
	const total = Math.round(duration);
	const minutes = Math.floor(total / 60);
	const seconds = total % 60;
	return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function addLyricsHeader(content: string, info?: LyricsFileInfo, source?: string): string {
	const parsed = parseLyrics(content);
	if (Object.keys(parsed.tags).length > 0) {
		return content;
	}
	const tags: LyricsTags = {
		ti: info?.title,
		ar: info?.artist,
		al: info?.album,
		length: formatLength(info?.duration),
		by: source,
		re: 'jamserve'
	};
	return buildLyrics(parsed.lines, tags);
}

export async function writeLyricsSidecar(filename: string, lyrics: TrackLyrics, info?: LyricsFileInfo): Promise<string | undefined> {
	const content = lyrics.syncedLyrics ?? lyrics.lyrics;
	if (!content) {
		return;
	}
	const candidates = lyrics.syncedLyrics ? lyricsSidecarCandidates(filename, LyricsSyncedExtensions) : lyricsSidecarCandidates(filename);
	for (const candidate of candidates) {
		if (await fse.pathExists(candidate)) {
			return;
		}
	}
	const extension = lyrics.syncedLyrics ? LyricsSyncedExtensions.at(0) : LyricsPlainExtensions.at(0);
	const target = path.join(path.dirname(filename), `${basenameStripExtension(filename)}${extension}`);
	const data = lyrics.syncedLyrics ? addLyricsHeader(content, info, lyrics.source) : content;
	const temporary = `${target}.jam-write`;
	try {
		await fse.writeFile(temporary, `${data}\n`, 'utf8');
		await fse.rename(temporary, target);
		log.debug('Lyrics file written', target);
		return target;
	} catch (error: unknown) {
		log.errorMsg(`Could not write lyrics file ${target}`, error);
		try {
			await fse.remove(temporary);
		} catch {
			// the temporary file could not be written in the first place
		}
		return;
	}
}
