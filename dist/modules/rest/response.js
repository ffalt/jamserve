import { ApiError } from '../deco/express/express-error.js';
import { ApiBaseResponder } from '../deco/express/express-responder.js';
import { errorToString } from '../../utils/error.js';
import { logger } from '../../utils/logger.js';
const log = logger('ApiResponder');
export class ApiResponder extends ApiBaseResponder {
    sendData(req, res, data) {
        this.sendJSON(req, res, data);
    }
    sendOK(_req, res) {
        res.status(200).json({ ok: true });
    }
    sendError(req, res, error) {
        let failCode = 0;
        let message;
        if (error instanceof ApiError) {
            failCode = error.failCode;
            message = error.message;
        }
        else {
            log.error('Unhandled API error:', errorToString(error));
            message = process.env.NODE_ENV === 'production' ?
                'An error occurred processing your request' :
                errorToString(error);
        }
        this.sendErrorMsg(req, res, failCode || 500, message || 'Guru Meditation');
    }
    sendErrorMsg(_req, res, code, message) {
        res.status(code).json({ error: message });
    }
}
//# sourceMappingURL=response.js.map