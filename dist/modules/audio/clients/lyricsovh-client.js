"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LyricsOVHClient = void 0;
const logger_1 = require("../../../utils/logger");
const webservice_client_1 = require("../../../utils/webservice-client");
const log = logger_1.logger('LyricsOVHClient');
class LyricsOVHClient extends webservice_client_1.WebserviceClient {
    constructor(userAgent) {
        super(1, 1000, userAgent);
    }
    async parseResult(response, body) {
        if (response.statusCode === 404) {
            return Promise.resolve(undefined);
        }
        return super.parseResult(response, body);
    }
    async search(artistName, songName) {
        const url = `https://api.lyrics.ovh/v1/${this.cleanString(artistName)}/${this.cleanString(songName)}`;
        log.info('requesting', url);
        const data = await this.getJson(url);
        if (!data || !data.lyrics) {
            return;
        }
        return { lyrics: data.lyrics, source: url };
    }
    cleanString(s) {
        return encodeURIComponent(s
            .replace(/[’´`]/g, '\'')
            .replace(/[():]/g, ' ')
            .replace(/[‐]/g, '-')
            .normalize()
            .trim());
    }
}
exports.LyricsOVHClient = LyricsOVHClient;
//# sourceMappingURL=lyricsovh-client.js.map