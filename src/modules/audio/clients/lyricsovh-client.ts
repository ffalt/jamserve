import request from 'request';
import {WebserviceClient} from '../../../utils/webservice-client';

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

	protected async parseResult<T>(response: request.Response, body: any): Promise<T> {
		if (response.statusCode === 404) {
			return Promise.resolve(undefined as any);
		}
		return super.parseResult<T>(response, body);
	}

	async search(artistName: string, songName: string): Promise<LyricsResult | undefined> {
		const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(songName)}`;
		const data = await this.getJson<LyricsOVHResult | undefined>(url);
		if (!data || !data.lyrics) {
			return;
		}
		return {lyrics: data.lyrics, source: url};
	}
}
