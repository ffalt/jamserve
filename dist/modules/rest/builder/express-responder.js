"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiBaseResponder = void 0;
const path_1 = __importDefault(require("path"));
class ApiBaseResponder {
    static sendJSONP(req, res, callback, data) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(`${callback}(${JSON.stringify(data)});`);
    }
    static sendOK(req, res) {
        res.status(200).json({ ok: true });
    }
    static sendString(req, res, data) {
        res.set('Content-Type', 'text/plain');
        res.status(200).send(data);
    }
    static sendJSON(req, res, data) {
        res.status(200).json(data);
    }
    static sendXML(req, res, data) {
        res.set('Content-Type', 'application/xml');
        res.status(200).send(data);
    }
    static sendError(req, res, err) {
        const msg = (typeof err === 'string' ? err : (err.message || 'Guru Meditation')).toString();
        const code = (typeof err.failCode === 'number' ? err.failCode : 500);
        ApiBaseResponder.sendErrorMsg(req, res, code || 500, msg);
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
            res.sendFile(data.file.filename, { filename: data.file.name || path_1.default.basename(data.file.filename) });
        }
    }
}
exports.ApiBaseResponder = ApiBaseResponder;
//# sourceMappingURL=express-responder.js.map