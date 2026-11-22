import fse from 'fs-extra';
import path from 'node:path';
import { buildLyrics, hasLyricsTimestamps, parseLyrics, plainLyrics } from '../../utils/lyrics-lrc.js';
import { basenameStripExtension } from '../../utils/fs-utils.js';
import { logger } from '../../utils/logger.js';
const log = logger('Lyrics:File');
export const LyricsSyncedExtensions = ['.lrc', '.elrc'];
export const LyricsPlainExtensions = ['.txt'];
export function durationToSeconds(milliseconds) {
    if (!milliseconds || milliseconds <= 0) {
        return;
    }
    return Math.round(milliseconds / 1000);
}
export function lyricsSidecarCandidates(filename, extensions = [...LyricsSyncedExtensions, ...LyricsPlainExtensions]) {
    const directory = path.dirname(filename);
    const base = basenameStripExtension(filename);
    const full = path.basename(filename);
    const result = [];
    for (const extension of extensions) {
        result.push(path.join(directory, `${base}${extension}`), path.join(directory, `${full}${extension}`));
    }
    return result;
}
export async function readLyricsSidecarSources(filename) {
    const result = [];
    const candidates = new Set(lyricsSidecarCandidates(filename));
    for (const candidate of candidates) {
        if (!await fse.pathExists(candidate)) {
            continue;
        }
        try {
            const raw = await fse.readFile(candidate, 'utf8');
            const content = raw.startsWith('\u{FEFF}') ? raw.slice(1) : raw;
            const { tags } = parseLyrics(content);
            result.push({
                name: path.basename(candidate),
                synced: hasLyricsTimestamps(content),
                source: tags.by,
                writtenByJam: tags.re === 'jamserve'
            });
        }
        catch (error) {
            log.errorMsg(`Could not read lyrics file ${candidate}`, error);
        }
    }
    return result;
}
export function lyricsFromText(text, source) {
    const content = (text.startsWith('\u{FEFF}') ? text.slice(1) : text).trim();
    if (!content) {
        return;
    }
    if (hasLyricsTimestamps(content)) {
        return { syncedLyrics: content, lyrics: plainLyrics(content), source };
    }
    return { lyrics: content, source };
}
export async function readLyricsSidecar(filename) {
    for (const candidate of lyricsSidecarCandidates(filename)) {
        if (!await fse.pathExists(candidate)) {
            continue;
        }
        try {
            const lyrics = lyricsFromText(await fse.readFile(candidate, 'utf8'), 'file');
            if (lyrics) {
                return lyrics;
            }
        }
        catch (error) {
            log.errorMsg(`Could not read lyrics file ${candidate}`, error);
        }
    }
    return;
}
function formatLength(duration) {
    if (!duration || duration <= 0) {
        return;
    }
    const total = Math.round(duration);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
export function addLyricsHeader(content, info, source) {
    const parsed = parseLyrics(content);
    if (Object.keys(parsed.tags).length > 0) {
        return content;
    }
    const tags = {
        ti: info?.title,
        ar: info?.artist,
        al: info?.album,
        length: formatLength(info?.duration),
        by: source,
        re: 'jamserve'
    };
    return buildLyrics(parsed.lines, tags);
}
export async function writeLyricsSidecar(filename, lyrics, info) {
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
    }
    catch (error) {
        log.errorMsg(`Could not write lyrics file ${target}`, error);
        try {
            await fse.remove(temporary);
        }
        catch {
        }
        return;
    }
}
//# sourceMappingURL=lyrics-file.js.map