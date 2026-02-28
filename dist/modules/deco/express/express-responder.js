import path from 'node:path';
import { validJSONP } from '../../../utils/jsonp.js';
function sanitizeContentDispositionFilename(name) {
    return name.replaceAll(/["\\]/g, '_').replaceAll(/[\u0000-\u001F\u007F]/g, '');
}
export class ApiBaseResponder {
    sendString(_req, res, data) {
        res.set('Content-Type', 'text/plain').status(200).send(data);
    }
    sendJSON(_req, res, data) {
        res.status(200).json(data);
    }
    sendJSONP(_req, res, callback, data) {
        if (!validJSONP(callback)) {
            res.status(400).send('Invalid callback parameter');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(`${callback}(${JSON.stringify(data)});`);
    }
    sendXML(_req, res, data) {
        res.set('Content-Type', 'application/xml; charset=utf-8');
        res.status(200).send(data);
    }
    sendBinary(req, res, data) {
        if (data.json) {
            this.sendJSON(req, res, data.json);
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
            const name = sanitizeContentDispositionFilename(data.file.name || path.basename(data.file.filename));
            res.sendFile(data.file.filename, {
                dotfiles: 'deny',
                headers: {
                    'Content-Disposition': `attachment; filename="${name}"`
                }
            });
        }
    }
}
//# sourceMappingURL=express-responder.js.map