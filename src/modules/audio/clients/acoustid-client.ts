import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { fpcalc, FPCalcOptions, FPCalcResult } from '../tools/fpcalc.js';
import { Acoustid } from './acoustid-rest-data.js';

const log = logger('Acoustid');

// ALL_META:
// recordings recordingids releases releaseids releasegroups releasegroupids tracks compress usermeta sources

const META_DEFAULT = 'recordings releases releasegroups tracks compress usermeta sources';

export interface AcoustidClientOptions {
	key: string;
	userAgent: string;
	meta?: string;
	fpcalc?: FPCalcOptions;
}

export class AcoustidClient extends WebserviceClient {
	options: AcoustidClientOptions;

	constructor(options: AcoustidClientOptions) {
		// https://acoustid.org/webservice
		super(1, 3000, 'JamServe/0.1.0');
		this.options = options;
	}

	private async get(fp: FPCalcResult, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		includes = includes ?? this.options.meta ?? META_DEFAULT;
		log.info('requesting by fingerprint', includes);
		const data = await this.getJsonWithParameters<Acoustid.Results, {
			format: string;
			meta: string;
			client: string;
			duration: string;
			fingerprint: string;
		}>('https://api.acoustid.org/v2/lookup', {
			format: 'json',
			meta: includes,
			client: this.options.key,
			duration: fp.duration.toFixed(0),
			fingerprint: fp.fingerprint
		});
		if (data.status !== 'ok') {
			return Promise.reject(new Error(data.status));
		}
		return data.results;
	}

	async acoustid(file: string, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		this.checkDisabled();
		const result = await fpcalc(file, this.options.fpcalc ?? {});
		return this.get(result, includes);
	}
}
