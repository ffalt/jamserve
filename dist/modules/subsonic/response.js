import { xml } from './xml.js';
import { ApiBaseResponder } from '../deco/express/express-responder.js';
import { SubsonicFormatter } from './formatter.js';
export class ApiResponder extends ApiBaseResponder {
    send(req, res, data) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const params = req.parameters;
        if ((params.format === 'jsonp') && (params.callback)) {
            this.sendJSONP(req, res, params.callback, data);
        }
        else if (params.format === 'json') {
            this.sendJSON(req, res, data);
        }
        else {
            data['subsonic-response'].xmlns = 'http://subsonic.org/restapi';
            this.sendXML(req, res, xml(data));
        }
    }
    sendData(req, res, data) {
        this.send(req, res, SubsonicFormatter.packResponse(data));
    }
    sendOK(req, res) {
        this.send(req, res, SubsonicFormatter.packOK());
    }
    sendError(req, res, err) {
        if (err?.fail) {
            this.send(req, res, SubsonicFormatter.packFail(err.code, err.fail));
        }
        else {
            this.send(req, res, SubsonicFormatter.packFail(SubsonicFormatter.FAIL.GENERIC, (typeof err === 'string' ? err : (err.message || 'Unknown Error')).toString()));
        }
    }
    sendBinary(req, res, data) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        super.sendBinary(req, res, data);
    }
}
//# sourceMappingURL=response.js.map