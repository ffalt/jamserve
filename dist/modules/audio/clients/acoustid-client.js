import { logger } from '../../../utils/logger.js';
import { WebserviceClient } from '../../../utils/webservice-client.js';
import { fpcalc } from '../tools/fpcalc.js';
const log = logger('Acoustid');
const META_DEFAULT = 'recordings releases releasegroups tracks compress usermeta sources';
export class AcoustidClient extends WebserviceClient {
    constructor(options) {
        super(1, 3000, 'JamServe/0.1.0');
        this.options = options;
    }
    async get(fp, includes) {
        includes = includes || this.options.meta || META_DEFAULT;
        log.info('requesting by fingerprint', includes);
        const data = await this.getJson('https://api.acoustid.org/v2/lookup', {
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
    async acoustid(file, includes) {
        this.checkDisabled();
        const result = await fpcalc(file, this.options.fpcalc || {});
        return this.get(result, includes);
    }
}
//# sourceMappingURL=acoustid-client.js.map