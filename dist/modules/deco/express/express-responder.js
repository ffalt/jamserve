import path from 'path';
export class ApiBaseResponder {
    sendString(req, res, data) {
        res.set('Content-Type', 'text/plain').status(200).send(data);
    }
    sendJSON(req, res, data) {
        res.status(200).json(data);
    }
    sendJSONP(req, res, callback, data) {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(`${callback}(${JSON.stringify(data)});`);
    }
    sendXML(req, res, data) {
        res.set('Content-Type', 'application/xml');
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
            res.sendFile(data.file.filename, {
                dotfiles: 'deny',
                headers: {
                    'Content-Disposition': `attachment; filename="${data.file.name || path.basename(data.file.filename)}"`
                }
            });
        }
    }
}
//# sourceMappingURL=express-responder.js.map