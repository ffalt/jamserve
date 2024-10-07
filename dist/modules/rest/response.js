import { ApiError } from '../deco/express/express-error.js';
import { ApiBaseResponder } from '../deco/express/express-responder.js';
export class ApiResponder extends ApiBaseResponder {
    sendData(req, res, data) {
        this.sendJSON(req, res, data);
    }
    sendOK(req, res) {
        res.status(200).json({ ok: true });
    }
    sendError(req, res, err) {
        let failCode = 0;
        let message = '';
        if (typeof err === 'string') {
            message = err;
        }
        else if (err instanceof ApiError) {
            failCode = err.failCode;
            message = err.message;
        }
        else if (err instanceof Error) {
            message = err.message;
        }
        this.sendErrorMsg(req, res, failCode || 500, message || 'Guru Meditation');
    }
    sendErrorMsg(req, res, code, msg) {
        res.status(code).json({ error: msg });
    }
}
//# sourceMappingURL=response.js.map