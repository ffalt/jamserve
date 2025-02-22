import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { Response } from 'node-fetch';
import { TrackLyrics } from '../../../entity/track/track.model.js';

const log = logger('LrclibClient');

export interface LrclibParams {
	track_name?: string;
	artist_name?: string;
	album_name?: string;
	duration?: number;
}

export interface LrclibResult {
	id: number;
	trackName: string;
	artistName: string;
	albumName: string;
	duration: number;
	instrumental: boolean;
	plainLyrics: string;
	syncedLyrics: string;
	source: string;
}

export class LrclibClient extends WebserviceClient {
	constructor(userAgent: string) {
		super(1, 1000, userAgent);
	}

	protected async parseResult<T>(response: Response): Promise<T | undefined> {
		if (response.status === 404) {
			return Promise.resolve({} as T);
		}
		return super.parseResult<T>(response);
	}

	async get(params: LrclibParams): Promise<LrclibResult | undefined> {
		log.info('requesting', JSON.stringify(params));
		return await this.getJson<LrclibResult | undefined, LrclibParams>('https://lrclib.net/api/get', params, true);
	}

	async find(params: LrclibParams): Promise<TrackLyrics> {
		const data = await this.get(params);
		if (!data || !(data.plainLyrics || data.syncedLyrics)) {
			return {};
		}
		return { lyrics: data.plainLyrics, syncedLyrics: data.syncedLyrics, source: `https://lrclib.net/api/get/${data.id}` };
	}
}
