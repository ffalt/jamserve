import {WebserviceClient} from '../../../utils/webservice-client';

export interface LyricsResult {
	lyrics: string;
	source: string;
}

export class LyricsOVHClient extends WebserviceClient {

	constructor(userAgent: string) {
		super(1, 1000, userAgent);
	}

	async search(artistName: string, songName: string): Promise<LyricsResult | undefined> {
		const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(songName)}`;
		const data = await this.getJson<any>(url);
		if (!data || !data.lyrics) {
			return;
		}
		return {lyrics: data.lyrics, source: url};
	}
}
