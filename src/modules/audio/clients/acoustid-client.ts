import {logger} from '../../../utils/logger';
import {WebserviceClient} from '../../../utils/webservice-client';
import {fpcalc, FPCalcOptions, FPCalcResult} from '../tools/fpcalc';
import {Acoustid} from './acoustid-rest-data';

const log = logger('Acoustid');

// const ALL_META_DEFAULT = 'recordings recordingids releases releaseids releasegroups releasegroupids tracks compress usermeta sources';

const META_DEFAULT = 'recordings releases releasegroups tracks compress usermeta sources';

declare namespace AcoustidClient {

	export interface AcoustidClientOptions {
		key: string;
		userAgent: string;
		meta?: string;
		fpcalc?: FPCalcOptions;
	}

}

export class AcoustidClient extends WebserviceClient {
	options: AcoustidClient.AcoustidClientOptions;

	constructor(options: AcoustidClient.AcoustidClientOptions) {
		// https://acoustid.org/webservice
		super(1, 3000, 'JamServe/0.1.0');
		this.options = options;
	}

	private async get(fp: FPCalcResult, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		includes = includes || this.options.meta || META_DEFAULT;
		log.info('requesting by fingerprint', includes);
		const data = await this.getJson<Acoustid.Results>('https://api.acoustid.org/v2/lookup', {
			format: 'json',
			meta: includes,
			client: this.options.key,
			duration: fp.duration.toFixed(0),
			fingerprint: fp.fingerprint
		});
		if (data.status !== 'ok') {
			return Promise.reject(Error(data.status));
		}
		return data.results;
	}

	async acoustid(file: string, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		this.checkDisabled();
		const result = await fpcalc(file, this.options.fpcalc || {});
		return this.get(result, includes);
	}
}
