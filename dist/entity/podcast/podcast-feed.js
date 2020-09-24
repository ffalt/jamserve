"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feed = void 0;
const feedparser_1 = __importDefault(require("feedparser"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const moment_1 = __importDefault(require("moment"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const zlib_1 = __importDefault(require("zlib"));
class Feed {
    static parseDurationMilliseconds(s) {
        return moment_1.default.duration(s).as('milliseconds');
    }
    static parseItunesDurationSeconds(s) {
        const num = Number(s);
        if (!s.includes(':') && !isNaN(num)) {
            return num;
        }
        if (s.length === 5) {
            s = `00:${s}`;
        }
        return moment_1.default.duration(s).as('seconds');
    }
    static getParams(str) {
        return str.split(';').reduce((para, param) => {
            const parts = param.split('=').map(part => part.trim());
            if (parts.length === 2) {
                para[parts[0]] = parts[1];
            }
            return para;
        }, {});
    }
    static maybeDecompress(res, encoding, done) {
        let decompress;
        if (encoding.match(/\bdeflate\b/)) {
            decompress = zlib_1.default.createInflate();
            decompress.on('error', done);
        }
        else if (encoding.match(/\bgzip\b/)) {
            decompress = zlib_1.default.createGunzip();
            decompress.on('error', done);
        }
        return decompress ? res.pipe(decompress) : res;
    }
    static maybeTranslate(res, charset, done) {
        if (charset && !/utf-*8/i.test(charset)) {
            try {
                const iv = iconv_lite_1.default.decodeStream(charset);
                iv.on('error', done);
                res = res.pipe(iv);
            }
            catch (err) {
                res.emit('error', err);
            }
        }
        return res;
    }
    async fetch(url) {
        const posts = [];
        const res = await node_fetch_1.default(url, {
            timeout: 10000,
            headers: {
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml'
            }
        });
        if (res.ok && res.status === 200) {
            let feed;
            return new Promise((resolve, reject) => {
                const done = (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({ feed, posts });
                    }
                };
                const feedParser = new feedparser_1.default({});
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
                res.body.pipe(feedParser);
            });
        }
        else {
            throw new Error(`Bad status code ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`);
        }
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
            image: data.feed.image && data.feed.image.url ? data.feed.image.url : undefined,
            categories: data.feed.categories
        };
        if (data.feed['itunes:summary'] && data.feed['itunes:summary']['#']) {
            tag.description = data.feed['itunes:summary']['#'];
        }
        const episodes = data.posts.map(post => {
            let chapters = [];
            const anypost = post;
            let duration;
            if (anypost['itunes:duration'] && anypost['itunes:duration']['#']) {
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
                enclosures: (post.enclosures || []).map(e => {
                    return { ...e, length: e.length ? Number(e.length) : undefined };
                }),
                date: post.date ? post.date : undefined,
                name: post.title,
                duration,
                chapters
            };
        });
        return { tag, episodes };
    }
}
exports.Feed = Feed;
//# sourceMappingURL=podcast-feed.js.map