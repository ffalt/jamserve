export interface LyricsLine {
	timestamp: number;
	text: string;
}

export interface ParsedLyrics {
	tags: Record<string, string>;
	lines: Array<LyricsLine>;
}

export interface LyricsTags {
	ti?: string;
	ar?: string;
	al?: string;
	by?: string;
	length?: string;
	re?: string;
}

const LINE_TIMESTAMP = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?]/g;
const WORD_TIMESTAMP = /<\d{1,3}:\d{1,2}(?:[.:]\d{1,3})?>/g;
const ID_TAG = /^\[([a-z]{2,}):(.*)]$/i;
const HAS_TIMESTAMP = /\[\d{1,3}:\d{1,2}(?:[.:]\d{1,3})?]/;

function fractionToMilliseconds(fraction?: string): number {
	if (!fraction) {
		return 0;
	}
	return Number(fraction.padEnd(3, '0').slice(0, 3));
}

function timestampToMilliseconds(match: RegExpExecArray | RegExpMatchArray): number {
	const minutes = Number(match.at(1));
	const seconds = Number(match.at(2));
	return (minutes * 60_000) + (seconds * 1000) + fractionToMilliseconds(match.at(3));
}

export function formatLyricsTimestamp(timestamp: number): string {
	const total = Math.max(0, Math.round(timestamp));
	const minutes = Math.floor(total / 60_000);
	const seconds = Math.floor((total % 60_000) / 1000);
	const hundredths = Math.floor((total % 1000) / 10);
	return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}]`;
}

export function hasLyricsTimestamps(text: string): boolean {
	return HAS_TIMESTAMP.test(text);
}

export function removeWordTimestamps(text: string): string {
	return text.replaceAll(WORD_TIMESTAMP, '').replaceAll(/ {2,}/g, ' ').trim();
}

export function parseLyrics(text: string): ParsedLyrics {
	const tags: Record<string, string> = {};
	const lines: Array<LyricsLine> = [];
	for (const raw of text.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line) {
			continue;
		}
		const idTag = ID_TAG.exec(line);
		if (idTag) {
			const [, key, value = ''] = idTag;
			if (key) {
				tags[key.toLowerCase()] = value.trim();
			}
			continue;
		}
		const stamps = line.matchAll(LINE_TIMESTAMP).toArray();
		if (stamps.length === 0) {
			continue;
		}
		let pendingStamps: Array<RegExpExecArray> = [];
		for (let index = 0; index < stamps.length; index++) {
			const stamp = stamps[index];
			const nextStamp = stamps.at(index + 1);
			const nextStampIndex = nextStamp ? nextStamp.index : line.length;
			const [firstStamp = ''] = stamp;
			const slice = line.slice(stamp.index + firstStamp.length, nextStampIndex).trim();
			pendingStamps.push(stamp);
			if (!(slice.length > 0 || index === stamps.length - 1)) {
				continue;
			}

			for (const pending of pendingStamps) {
				lines.push({ timestamp: timestampToMilliseconds(pending), text: slice });
			}
			pendingStamps = [];
		}
	}
	lines.sort((a, b) => a.timestamp - b.timestamp);
	return { tags, lines };
}

export function buildLyrics(lines: Array<LyricsLine>, tags?: LyricsTags): string {
	const result = Object.entries(tags ?? {})
		.filter(([, value]) => value)
		.map(([key, value]) => `[${key}:${value}]`);
	for (const line of lines) {
		result.push(`${formatLyricsTimestamp(line.timestamp)}${line.text}`);
	}
	return result.join('\n');
}

export function plainLyrics(text: string): string {
	const lines = text.split(/\r?\n/)
		.map(line => line.trim())
		.filter(line => !ID_TAG.test(line))
		.map(line => removeWordTimestamps(line.replaceAll(LINE_TIMESTAMP, '')));

	const result: Array<string> = [];
	for (const line of lines) {
		if (line.length === 0) {
			if (result.length > 0 && result.at(-1)?.length !== 0) {
				result.push('');
			}
		} else {
			result.push(line);
		}
	}
	while (result.length > 0 && result.at(-1)?.length === 0) {
		result.pop();
	}
	return result.join('\n');
}

export function lyricsToEvents(text: string): Array<{ timestamp: number; text: string }> {
	return parseLyrics(text).lines.map(line => ({ timestamp: line.timestamp, text: removeWordTimestamps(line.text) }));
}

export function eventsToLyrics(events: Array<{ timestamp: number; text: string }>, tags?: LyricsTags): string {
	return buildLyrics(events.map(event => ({ timestamp: event.timestamp, text: event.text })), tags);
}

export function lyricsLanguageCode(language = ''): string {
	const code = language.trim().toLowerCase();
	return /^[a-z]{3}$/.test(code) ? code : 'und';
}

export interface SynchronisedLyricsData {
	id: string;
	language: string;
	timestampFormat: number;
	contentType: number;
	events: Array<{ timestamp: number; text: string }>;
}

export function parseSimplifiedSynchronisedLyrics(value?: string): SynchronisedLyricsData | undefined {
	if (!value) {
		return;
	}
	let language = 'und';
	let timestampFormat = 2;
	let contentType = 1;
	let id = 'lyrics';
	const events: Array<{ timestamp: number; text: string }> = [];

	if (hasLyricsTimestamps(value)) {
		const parsedEvents = lyricsToEvents(value);
		if (parsedEvents.length > 0) {
			return { id, language, timestampFormat, contentType, events: parsedEvents };
		}
	}

	const parts = value.split(';');
	for (const part of parts) {
		if (part.startsWith('lang=')) {
			language = lyricsLanguageCode(part.slice(5));
		} else if (part.startsWith('format=')) {
			const format = Number(part.slice(7));
			if (!Number.isNaN(format)) {
				timestampFormat = format;
			}
		} else if (part.startsWith('contentType=')) {
			const type = Number(part.slice(12));
			if (!Number.isNaN(type)) {
				contentType = type;
			}
		} else if (part.startsWith('id=')) {
			id = part.slice(3);
		} else if (part.includes('@')) {
			const eventStrings = part.split('|');
			for (const eventString of eventStrings) {
				const lastAt = eventString.lastIndexOf('@');
				if (lastAt === -1) {
					continue;
				}
				const text = eventString.slice(0, lastAt);
				const timestamp = Number(eventString.slice(lastAt + 1));
				if (!Number.isNaN(timestamp)) {
					events.push({ timestamp, text });
				}
			}
		}
	}

	if (events.length === 0) {
		return;
	}
	events.sort((a, b) => a.timestamp - b.timestamp);
	return { id, language, timestampFormat, contentType, events };
}
