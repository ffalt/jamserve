import {logger} from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';
import {Response} from 'node-fetch';

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

	protected async parseResult<T>(response: Response): Promise<T | undefined> {
		if (response.status === 404) {
			return Promise.resolve({} as T);
		}
		return super.parseResult<T>(response);
	}

	async search(artistName: string, songName: string): Promise<LyricsResult | undefined> {
		const url = `https://api.lyrics.ovh/v1/${LyricsOVHClient.cleanString(artistName)}/${LyricsOVHClient.cleanString(songName)}`;
		log.info('requesting', url);
		const data = await this.getJson<LyricsOVHResult | undefined>(url, undefined, true);
		if (!data || !data.lyrics) {
			return;
		}
		return {lyrics: data.lyrics, source: url};
	}

	private static cleanString(s: string): string {
		return encodeURIComponent(s
			.replace(/[’´`]/g, '\'')
			.replace(/[():]/g, ' ')
			.replace(/[‐]/g, '-')
			.normalize()
			.trim()
		);
	}
}
