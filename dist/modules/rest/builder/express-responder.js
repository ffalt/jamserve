import path from 'path';
import { ApiError } from './express-error.js';
export class ApiBaseResponder {
    static sendOK(req, res) {
        res.status(200).json({ ok: true });
    }
    static sendString(req, res, data) {
        res.set('Content-Type', 'text/plain').status(200).send(data);
    }
    static sendJSON(req, res, data) {
        res.status(200).json(data);
    }
    static sendError(req, res, err) {
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
        ApiBaseResponder.sendErrorMsg(req, res, failCode || 500, message || 'Guru Meditation');
    }
    static sendErrorMsg(req, res, code, msg) {
        res.status(code).json({ error: msg });
    }
    static sendBinary(req, res, data) {
        if (data.json) {
            ApiBaseResponder.sendJSON(req, res, data.json);
        }
        else if (data.pipe) {
            data.pipe.pipe(res);
        }
        else if (data.buffer) {
            res.set('Content-Type', data.buffer.contentType);
            res.set('Content-Length', data.buffer.buffer.length.toString());
            res.status(200).send(data.buffer.buffer);
        }
        else if (data.file) {
            res.sendFile(data.file.filename, { filename: data.file.name || path.basename(data.file.filename) });
        }
    }
}
//# sourceMappingURL=express-responder.js.map