"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcoustidClient = void 0;
const logger_1 = require("../../../utils/logger");
const webservice_client_1 = require("../../../utils/webservice-client");
const fpcalc_1 = require("../tools/fpcalc");
const log = logger_1.logger('Acoustid');
const META_DEFAULT = 'recordings releases releasegroups tracks compress usermeta sources';
class AcoustidClient extends webservice_client_1.WebserviceClient {
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
        const result = await fpcalc_1.fpcalc(file, this.options.fpcalc || {});
        return this.get(result, includes);
    }
}
exports.AcoustidClient = AcoustidClient;
//# sourceMappingURL=acoustid-client.js.map