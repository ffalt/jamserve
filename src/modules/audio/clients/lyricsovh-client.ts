import request from 'request';
import {logger} from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';

const log = logger('LyricsOVHClient');

export interface LyricsResult {
	lyrics: string;
	source: string;
}

export interface LyricsOVHResult {
	lyrics: string;
	error?: string;
}

export class LyricsOVHClient extends WebserviceClient {

	constructor(userAgent: string) {
		super(1, 1000, userAgent);
	}

	protected async parseResult<T>(response: request.Response, body: string): Promise<T | undefined> {
		if (response.statusCode === 404) {
			return Promise.resolve(undefined);
		}
		return super.parseResult<T>(response, body);
	}

	async search(artistName: string, songName: string): Promise<LyricsResult | undefined> {
		const url = `https://api.lyrics.ovh/v1/${this.cleanString(artistName)}/${this.cleanString(songName)}`;
		log.info('requesting', url);
		const data = await this.getJson<LyricsOVHResult | undefined>(url);
		if (!data || !data.lyrics) {
			return;
		}
		return {lyrics: data.lyrics, source: url};
	}

	private cleanString(s: string): string {
		return encodeURIComponent(s
			.replace(/[’´`]/g, '\'')
			.replace(/[():]/g, ' ')
			.replace(/[‐]/g, '-')
			.normalize()
			.trim()
		);
	}
}
