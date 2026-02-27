import FeedParser from 'feedparser';
import iconvDefault, { Iconv as IconvType } from 'iconv-lite';
import { parseDurationToMilliseconds, parseDurationToSeconds } from '../../utils/date-time.js';
import fetch from 'node-fetch';
import zlib from 'node:zlib';
import { Podcast } from './podcast.js';
import { EpisodeChapter } from '../episode/episode.js';
import { validateExternalUrl } from '../../utils/url-check.js';

const iconv = iconvDefault as unknown as typeof IconvType;

export interface PodcastTag {
	title?: string;
	description?: string;
	link?: string;
	author?: string;
	generator?: string;
	language?: string;
	image?: string;
	categories?: Array<string>;
}

export interface EpisodeEnclosure {
	url: string;
	type?: string; // e.g. "audio/mpeg"
	length?: number; // e.g. "0"
}

export interface EpisodeData {
	name?: string;
	date?: Date;
	author?: string;
	link?: string;
	guid?: string;
	summary?: string;
	enclosures?: Array<EpisodeEnclosure>;
	duration?: number;
	chapters?: Array<EpisodeChapter>;
}

export class Feed {
	static parseDurationMilliseconds(s: string): number {
		return parseDurationToMilliseconds(s);
	}

	static parseItunesDurationSeconds(value: string): number {
		const number = Number(value);
		if (!value.includes(':') && !Number.isNaN(number)) {
			return number;
		}
		if (value.length === 5) {
			value = `00:${value}`;
		}
		return parseDurationToSeconds(value);
	}

	static getParams(value: string): Record<string, string> {
		const parameters: Record<string, string> = {};
		for (const parameter of value.split(';')) {
			const parts = parameter.split('=').map(part => part.trim());
			const part0 = parts.at(0);
			const part1 = parts.at(1);
			if (part0 && part1) {
				parameters[part0] = part1;
			}
		}
		return parameters;
	}

	static maybeDecompress(stream: NodeJS.ReadableStream, encoding: string, done: (error?: unknown) => void): NodeJS.ReadableStream {
		let decompress: zlib.Inflate | zlib.Gunzip | undefined;
		if ((/\bdeflate\b/).test(encoding)) {
			decompress = zlib.createInflate();
			decompress.on('error', done);
		} else if ((/\bgzip\b/).test(encoding)) {
			decompress = zlib.createGunzip();
			decompress.on('error', done);
		}
		return decompress ? stream.pipe(decompress) : stream;
	}

	static maybeTranslate(stream: NodeJS.ReadableStream, charset: string, done: (error?: unknown) => void): NodeJS.ReadableStream {
		// Use iconv if its not utf8 already.
		if (charset && !/utf-*8/i.test(charset)) {
			try {
				const iv = iconv.decodeStream(charset);
				iv.on('error', done);
				// If we're using iconv, stream will be the output of iconv
				// otherwise it will remain the output of request
				stream = stream.pipe(iv);
			} catch (error: unknown) {
				stream.emit('error', error);
			}
		}
		return stream;
	}

	private async fetch(url: string): Promise<{ feed: FeedParser.Node; posts: Array<FeedParser.Item> }> {
		const posts: Array<FeedParser.Item> = [];
		await validateExternalUrl(url);
		const result = await fetch(url, {
			// timeout: 10000,
			headers: {
				// Some feeds do not respond without user-agent and accept headers.
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
				'accept': 'text/html,application/xhtml+xml'
			}
		});
		if (result.ok && result.status === 200) {
			let feed: Record<string, any>;
			return new Promise<{ feed: FeedParser.Node; posts: Array<FeedParser.Item> }>((resolve, reject) => {
				const done = (error?: unknown): void => {
					if (error) {
						reject(error as unknown);
					} else {
						resolve({ feed, posts });
					}
				};
				const feedParser = new FeedParser({});
				feedParser.on('readable', function streamResponse(): void {
					const response = feedParser;
					feed = response.meta;
					let item = response.read() as FeedParser.Item | undefined;
					while (item) {
						posts.push(item);
						item = response.read() as FeedParser.Item | undefined;
					}
				});
				feedParser.on('error', done);
				feedParser.on('end', done);
				if (!result.body) {
					done(new Error('Bad feed stream'));
					return;
				}
				result.body.pipe(feedParser);
			});
		}
		throw new Error(`Bad status code ${result.status} ${result.statusText}`.trimEnd());
	}

	public async get(podcast: Podcast): Promise<{ tag: PodcastTag; episodes: Array<EpisodeData> }> {
		const data = await this.fetch(podcast.url);
		const tag: PodcastTag = {
			title: data.feed.title,
			description: data.feed.description,
			link: data.feed.link,
			author: data.feed.author,
			generator: data.feed.generator,
			language: data.feed.language,
			image: data.feed.image?.url,
			categories: data.feed.categories
		};
		if (data.feed['itunes:summary']?.['#']) {
			tag.description = data.feed['itunes:summary']['#'];
		}
		const episodes: Array<EpisodeData> = data.posts.map(post => {
			let chapters: Array<EpisodeChapter> = [];

			const anypost = post as any;
			let duration: number | undefined;
			if (anypost?.['itunes:duration']?.['#']) {
				duration = Feed.parseItunesDurationSeconds(anypost['itunes:duration']['#'] as string);
			}
			const pscChaps: any = anypost['psc:chapters'];
			if (pscChaps) {
				const pscChap: Array<any> | undefined = pscChaps['psc:chapter'];
				if (pscChap) {
					chapters = pscChap.map(item => {
						const entry = item['@'];
						return { start: Feed.parseDurationMilliseconds(entry.start as string), title: entry.title };
					}).sort((a, b) => a.start - b.start);
				}
			}
			return {
				author: post.author,
				link: post.link,
				guid: post.guid || post.link,
				summary: post.summary,
				enclosures: post.enclosures.map(enclosure => {
					return { ...enclosure, length: enclosure.length === undefined ? undefined : Number(enclosure.length) };
				}),
				date: post.date ?? undefined,
				name: post.title,
				duration,
				chapters
			};
		});
		return { tag, episodes };
	}
}
