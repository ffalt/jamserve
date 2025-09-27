import { xml } from './xml.js';
import { ApiBaseResponder } from '../deco/express/express-responder.js';
import { SubsonicFormatter } from './formatter.js';
import { errorNumberCode, errorToString } from '../../utils/error.js';
export class ApiResponder extends ApiBaseResponder {
    send(req, res, data) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const parameters = req.parameters;
        if ((parameters.format === 'jsonp') && (parameters.callback)) {
            this.sendJSONP(req, res, parameters.callback, data);
        }
        else if (parameters.format === 'json') {
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
    sendError(req, res, error) {
        this.send(req, res, SubsonicFormatter.packFail(errorNumberCode(error) ?? SubsonicFormatter.FAIL.GENERIC, errorToString(error)));
    }
    sendBinary(req, res, data) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        super.sendBinary(req, res, data);
    }
}
//# sourceMappingURL=response.js.map