import {NodeError, NodeErrorCallback} from '../typings';
import zlib from 'zlib';
import stream from 'stream';
import request from 'request';
import FeedParser from 'feedparser';
import iconv from 'iconv-lite';
import {DBObjectType, PodcastStatus} from '../types';
import {Subsonic} from '../model/subsonic-rest-data';
import {PodcastTag} from '../objects/podcast/podcast.model';
import {Episode, PodcastEpisodeChapter} from '../objects/episode/episode.model';

export class Feed {

	constructor() {

	}

	private getParams(str: string): { [key: string]: string } {
		return str.split(';').reduce(
			(para: { [key: string]: string }, param: string) => {
				const parts = param.split('=').map(function(part) {
					return part.trim();
				});
				if (parts.length === 2) {
					para[parts[0]] = parts[1];
				}
				return para;
			}, {});
	}

	private maybeDecompress(res: stream.Readable, encoding: string, done: NodeErrorCallback): stream.Readable {
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

	private maybeTranslate(res: stream.Readable, charset: string, done: NodeErrorCallback): stream.Readable {
		// Use iconv if its not utf8 already.
		if (charset && !/utf-*8/i.test(charset)) {
			try {
				const iv = iconv.decodeStream(charset);
				// console.log('Converting from charset %s to utf-8', charset);
				iv.on('error', done);
				// If we're using iconv, stream will be the output of iconv
				// otherwise it will remain the output of request
				res = <any>res.pipe(iv); // TODO: iconv stream doesn't return a stream.Readable?
			} catch (err) {
				res.emit('error', err);
			}
		}
		return res;
	}

	private async fetch(url: string): Promise<{ feed: FeedParser.Node, posts: Array<FeedParser.Item> }> {
		const posts: Array<FeedParser.Item> = [];
		let feed: any;
		let doneReported = false;
		const req = request(url, {timeout: 10000, pool: false});
		req.setMaxListeners(50);
		// Some feeds do not respond without user-agent and accept headers.
		req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
		req.setHeader('accept', 'text/html,application/xhtml+xml');

		const feedparser = new FeedParser({});

		feedparser.on('readable', function streamResponse() {
			const response = feedparser; // this;
			feed = response.meta;
			let item = response.read();
			while (item) {
				posts.push(item);
				item = response.read();
			}
		});

		return new Promise<{ feed: FeedParser.Node, posts: Array<FeedParser.Item> }>((resolve, reject) => {
			const done = (err: NodeError) => {
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
					return done(new Error('Bad status code ' + res.statusCode + (res.statusMessage ? ' ' + res.statusMessage : '')));
				}
				const encoding = res.headers['content-encoding'] || 'identity';
				const charset = this.getParams(res.headers['content-type'] || '').charset;
				let pipestream = this.maybeDecompress(res, encoding, done);
				pipestream = this.maybeTranslate(pipestream, charset, done);
				pipestream.pipe(feedparser);
			});

			feedparser.on('error', done);
			feedparser.on('end', done);

		});
	}

	public async get(podcast: Subsonic.PodcastChannel): Promise<{ tag: PodcastTag, episodes: Array<Episode> }> {
		const data = await this.fetch(podcast.url);
		const tag: PodcastTag = {
			title: data.feed.title,
			description: data.feed.description,
			link: data.feed.link,
			author: data.feed.author,
			generator: data.feed.generator,
			image: data.feed.image && data.feed.image.url ? data.feed.image.url : undefined,
			categories: data.feed.categories
		};
		if (data.feed['itunes:summary'] && data.feed['itunes:summary']['#']) {
			tag.description = data.feed['itunes:summary']['#'];
		}
		const episodes: Array<Episode> = data.posts.map(post => {
			let chapters: Array<PodcastEpisodeChapter> = [];

			const pscChaps: any = (<any>post)['psc:chapters'];
			if (pscChaps) {
				const pscChap: Array<any> = pscChaps['psc:chapter'];
				if (pscChap) {
					chapters = pscChap.map(item => item['@']);
				}
			}
			return {
				id: '',
				podcastID: podcast.id,
				status: PodcastStatus.new,
				type: DBObjectType.episode,
				author: post.author,
				link: post.link,
				guid: post.guid,
				summary: post.summary,
				enclosures: <any>post.enclosures, // TODO: validate podcast enclosures (wrong interface description?)
				date: post.date ? post.date.valueOf() : 0,
				name: post.title,
				chapters: chapters
			};
		});
		return {tag, episodes};
	}

}
