import FeedParser from 'feedparser';
import iconvDefault from 'iconv-lite';
import { parseDurationToMilliseconds, parseDurationToSeconds } from '../../utils/date-time.js';
import fetch from 'node-fetch';
import zlib from 'node:zlib';
import { validateExternalUrl } from '../../utils/url-check.js';
const iconv = iconvDefault;
export class Feed {
    static parseDurationMilliseconds(s) {
        return parseDurationToMilliseconds(s);
    }
    static parseItunesDurationSeconds(value) {
        const number = Number(value);
        if (!value.includes(':') && !Number.isNaN(number)) {
            return number;
        }
        if (value.length === 5) {
            value = `00:${value}`;
        }
        return parseDurationToSeconds(value);
    }
    static getParams(value) {
        const parameters = {};
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
    static maybeDecompress(stream, encoding, done) {
        let decompress;
        if ((/\bdeflate\b/).test(encoding)) {
            decompress = zlib.createInflate();
            decompress.on('error', done);
        }
        else if ((/\bgzip\b/).test(encoding)) {
            decompress = zlib.createGunzip();
            decompress.on('error', done);
        }
        return decompress ? stream.pipe(decompress) : stream;
    }
    static maybeTranslate(stream, charset, done) {
        if (charset && !/utf-*8/i.test(charset)) {
            try {
                const iv = iconv.decodeStream(charset);
                iv.on('error', done);
                stream = stream.pipe(iv);
            }
            catch (error) {
                stream.emit('error', error);
            }
        }
        return stream;
    }
    async fetch(url) {
        const posts = [];
        await validateExternalUrl(url);
        const result = await fetch(url, {
            signal: AbortSignal.timeout(30000),
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml'
            }
        });
        if (result.ok && result.status === 200) {
            const contentLength = Number(result.headers.get('content-length'));
            if (contentLength && contentLength > Feed.MAX_FEED_SIZE) {
                throw new Error(`Feed response too large: ${contentLength} bytes exceeds limit of ${Feed.MAX_FEED_SIZE} bytes`);
            }
            let feed;
            return new Promise((resolve, reject) => {
                let received = 0;
                const done = (error) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve({ feed, posts });
                    }
                };
                const feedParser = new FeedParser({});
                feedParser.on('readable', function streamResponse() {
                    const response = feedParser;
                    feed = response.meta;
                    let item = response.read();
                    while (item) {
                        posts.push(item);
                        item = response.read();
                    }
                });
                feedParser.on('error', done);
                feedParser.on('end', done);
                if (!result.body) {
                    done(new Error('Bad feed stream'));
                    return;
                }
                const body = result.body;
                body.on('data', (chunk) => {
                    received += chunk.length;
                    if (received > Feed.MAX_FEED_SIZE) {
                        body.destroy();
                        reject(new Error(`Feed response too large: exceeded limit of ${Feed.MAX_FEED_SIZE} bytes`));
                    }
                });
                body.pipe(feedParser);
            });
        }
        throw new Error(`Bad status code ${result.status} ${result.statusText}`.trimEnd());
    }
    async get(podcast) {
        const data = await this.fetch(podcast.url);
        const tag = {
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
        const episodes = data.posts.map(post => {
            let chapters = [];
            const anypost = post;
            let duration;
            if (anypost?.['itunes:duration']?.['#']) {
                duration = Feed.parseItunesDurationSeconds(anypost['itunes:duration']['#']);
            }
            const pscChaps = anypost['psc:chapters'];
            if (pscChaps) {
                const pscChap = pscChaps['psc:chapter'];
                if (pscChap) {
                    chapters = pscChap.map(item => {
                        const entry = item['@'];
                        return { start: Feed.parseDurationMilliseconds(entry.start), title: entry.title };
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
Feed.MAX_FEED_SIZE = 10 * 1024 * 1024;
//# sourceMappingURL=podcast-feed.js.map