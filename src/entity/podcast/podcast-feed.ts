import FeedParser from 'feedparser';
import iconv from 'iconv-lite';
import moment from 'moment';
import request from 'request';
import stream from 'stream';
import zlib from 'zlib';
import {Podcast} from './podcast';
import {EpisodeChapter} from '../episode/episode';

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
		return moment.duration(s).as('milliseconds');
	}

	static parseItunesDurationSeconds(s: string): number {
		const num = Number(s);
		if (!s.includes(':') && !isNaN(num)) {
			return num;
		}
		if (s.length === 5) {
			s = `00:${s}`;
		}
		return moment.duration(s).as('seconds');
	}

	static getParams(str: string): { [key: string]: string } {
		return str.split(';').reduce(
			(para: { [key: string]: string }, param: string) => {
				const parts = param.split('=').map(part => part.trim());
				if (parts.length === 2) {
					para[parts[0]] = parts[1];
				}
				return para;
			}, {});
	}

	static maybeDecompress(res: stream.Readable, encoding: string, done: (err?: Error) => void): stream.Readable {
		let decompress;
		if (encoding.match(/\bdeflate\b/)) {
			decompress = zlib.createInflate();
			decompress.on('error', done);
		} else if (encoding.match(/\bgzip\b/)) {
			decompress = zlib.createGunzip();
			decompress.on('error', done);
		}
		return decompress ? res.pipe(decompress) : res;
	}

	static maybeTranslate(res: stream.Readable, charset: string, done: (err?: Error) => void): stream.Readable {
		// Use iconv if its not utf8 already.
		if (charset && !/utf-*8/i.test(charset)) {
			try {
				const iv = iconv.decodeStream(charset);
				iv.on('error', done);
				// If we're using iconv, stream will be the output of iconv
				// otherwise it will remain the output of request
				res = res.pipe(iv) as any; // TODO: iconv stream doesn't return a stream.Readable?
			} catch (err) {
				res.emit('error', err);
			}
		}
		return res;
	}

	private async fetch(url: string): Promise<{ feed: FeedParser.Node; posts: Array<FeedParser.Item> }> {
		const posts: Array<FeedParser.Item> = [];
		let feed: any;
		let doneReported = false;
		const req = request(url, {timeout: 10000, pool: false});
		req.setMaxListeners(50);
		// Some feeds do not respond without user-agent and accept headers.
		req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
		req.setHeader('accept', 'text/html,application/xhtml+xml');

		const feedParser = new FeedParser({});

		feedParser.on('readable', function streamResponse(): void {
			const response = feedParser;
			feed = response.meta;
			let item = response.read();
			while (item) {
				posts.push(item);
				item = response.read();
			}
		});

		return new Promise<{ feed: FeedParser.Node; posts: Array<FeedParser.Item> }>((resolve, reject) => {
			const done = (err?: Error): void => {
				if (doneReported) {
					return;
				}
				doneReported = true;
				if (err) {
					reject(err);
				} else {
					resolve({feed, posts});
				}
			};

			req.on('error', done);
			req.on('response', (res: request.Response) => {
				if (res.statusCode !== 200) {
					req.abort();
					return done(new Error(`Bad status code ${res.statusCode}${res.statusMessage ? ` ${res.statusMessage}` : ''}`));
				}
				const encoding = res.headers['content-encoding'] || 'identity';
				const charset = Feed.getParams(res.headers['content-type'] || '').charset;
				let pipestream = Feed.maybeDecompress(res, encoding, done);
				pipestream = Feed.maybeTranslate(pipestream, charset, done);
				pipestream.pipe(feedParser);
			});

			feedParser.on('error', done);
			feedParser.on('end', done);
		});
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
			image: data.feed.image && data.feed.image.url ? data.feed.image.url : undefined,
			categories: data.feed.categories
		};
		if (data.feed['itunes:summary'] && data.feed['itunes:summary']['#']) {
			tag.description = data.feed['itunes:summary']['#'];
		}
		const episodes: Array<EpisodeData> = data.posts.map(post => {
			let chapters: Array<EpisodeChapter> = [];

			const anypost = post as any;
			let duration: number | undefined;
			if (anypost['itunes:duration'] && anypost['itunes:duration']['#']) {
				duration = Feed.parseItunesDurationSeconds(anypost['itunes:duration']['#']);
			}
			const pscChaps: any = anypost['psc:chapters'];
			if (pscChaps) {
				const pscChap: Array<any> = pscChaps['psc:chapter'];
				if (pscChap) {
					chapters = pscChap.map(item => {
						const entry = item['@'];
						return {start: Feed.parseDurationMilliseconds(entry.start), title: entry.title};
					}).sort((a, b) => a.start - b.start);
				}
			}
			return {
				author: post.author,
				link: post.link,
				guid: post.guid || post.link,
				summary: post.summary,
				enclosures: (post.enclosures || []).map(e => {
					return {...e, length: e.length ? Number(e.length) : undefined};
				}),
				date: post.date ? post.date : undefined,
				name: post.title,
				duration,
				chapters
			};
		});
		return {tag, episodes};
	}

}
