import { Transform } from 'node:stream';
import { MetaDataBlock } from './block.js';
import { MetaDataBlockPicture } from './block.picture.js';
import { MetaDataBlockStreamInfo } from './block.streaminfo.js';
import { BlockVorbiscomment } from './block.vorbiscomment.js';
var STATE;
(function (STATE) {
    STATE[STATE["IDLE"] = 0] = "IDLE";
    STATE[STATE["MARKER"] = 1] = "MARKER";
    STATE[STATE["MDB_HEADER"] = 2] = "MDB_HEADER";
    STATE[STATE["MDB"] = 3] = "MDB";
    STATE[STATE["PASS_THROUGH"] = 4] = "PASS_THROUGH";
    STATE[STATE["SCAN_MARKER"] = 5] = "SCAN_MARKER";
})(STATE || (STATE = {}));
export var MDB_TYPE;
(function (MDB_TYPE) {
    MDB_TYPE[MDB_TYPE["STREAMINFO"] = 0] = "STREAMINFO";
    MDB_TYPE[MDB_TYPE["PADDING"] = 1] = "PADDING";
    MDB_TYPE[MDB_TYPE["APPLICATION"] = 2] = "APPLICATION";
    MDB_TYPE[MDB_TYPE["SEEKTABLE"] = 3] = "SEEKTABLE";
    MDB_TYPE[MDB_TYPE["VORBIS_COMMENT"] = 4] = "VORBIS_COMMENT";
    MDB_TYPE[MDB_TYPE["CUESHEET"] = 5] = "CUESHEET";
    MDB_TYPE[MDB_TYPE["PICTURE"] = 6] = "PICTURE";
    MDB_TYPE[MDB_TYPE["INVALID"] = 127] = "INVALID";
})(MDB_TYPE || (MDB_TYPE = {}));
export class FlacProcessorStream extends Transform {
    constructor(reportID3 = false, parseMetaDataBlocks = false, options) {
        super(options);
        this.reportID3 = reportID3;
        this.parseMetaDataBlocks = parseMetaDataBlocks;
        this.hasError = false;
        this.hasID3 = false;
        this.isFlac = false;
        this.state = STATE.IDLE;
        this.bufPos = 0;
        this.mdbLen = 0;
        this.mdbLast = false;
        this.mdbPush = false;
        this.mdbLastWritten = false;
    }
    _transform(buffer, _encoding, callback) {
        const chunk = { buffer, pos: 0, length: buffer.length, done: false };
        while (!chunk.done) {
            this.process(chunk);
        }
        callback();
    }
    _flush(callback) {
        if (!this.hasError) {
            this.emit('done');
        }
        this.state = STATE.IDLE;
        this.mdbLastWritten = false;
        this.hasID3 = false;
        this.isFlac = false;
        this.bufPos = 0;
        this.buf = undefined;
        this.mdb = undefined;
        callback();
    }
    scanSetFlac(chunk, pos) {
        if (this.reportID3) {
            let rest = Buffer.from(chunk.buffer.subarray(0, pos));
            if (this.buf) {
                rest = Buffer.concat([this.buf, rest]);
            }
            this.emit('id3', rest);
        }
        this.isFlac = true;
        chunk.pos = pos;
        this.bufPos = 0;
        this.buf = undefined;
    }
    scan(chunk) {
        for (let index = chunk.pos; index < chunk.length; index++) {
            const slice = Buffer.from(chunk.buffer.subarray(index, index + 4)).toString('utf8', 0);
            if (slice === 'fLaC') {
                this.scanSetFlac(chunk, index);
                return;
            }
        }
        if (this.reportID3) {
            this.buf = this.buf ? Buffer.concat([this.buf, chunk.buffer]) : chunk.buffer;
        }
    }
    safePushFull(chunk, minCapacity, persist, validate) {
        let slice;
        if (persist) {
            if (this.bufPos > 0 && this.buf) {
                chunk.buffer.copy(this.buf, this.bufPos, chunk.pos, chunk.pos + minCapacity - this.bufPos);
                slice = Buffer.from(this.buf.subarray(0, minCapacity));
            }
            else {
                slice = Buffer.from(chunk.buffer.subarray(chunk.pos, chunk.pos + minCapacity));
            }
        }
        else {
            slice = Buffer.from(chunk.buffer.subarray(chunk.pos, chunk.pos + minCapacity - this.bufPos));
        }
        if (validate(slice, true)) {
            this.push(slice);
        }
        chunk.pos += minCapacity - this.bufPos;
        this.bufPos = 0;
        this.buf = undefined;
    }
    safePushIncomplete(chunk, minCapacity, persist, validate) {
        if (persist) {
            this.buf = this.buf ?? Buffer.alloc(minCapacity);
            chunk.buffer.copy(this.buf, this.bufPos, chunk.pos, chunk.length);
        }
        else {
            const slice = Buffer.from(chunk.buffer.subarray(chunk.pos, chunk.length));
            if (validate(slice, false)) {
                this.push(slice);
            }
        }
        this.bufPos += chunk.length - chunk.pos;
    }
    safePush(chunk, minCapacity, persist, validate) {
        const isDone = (chunk.length - chunk.pos + this.bufPos >= minCapacity);
        if (isDone) {
            this.safePushFull(chunk, minCapacity, persist, validate);
        }
        else {
            this.safePushIncomplete(chunk, minCapacity, persist, validate);
        }
        return isDone;
    }
    processIDLE() {
        this.state = STATE.MARKER;
    }
    processSCANMARKER(chunk) {
        this.scan(chunk);
        if (this.isFlac) {
            this.state = STATE.MARKER;
        }
        else {
            chunk.done = true;
        }
    }
    processMARKER(chunk) {
        if (this.safePush(chunk, 4, true, slice => this.validateMarker(slice))) {
            let newState = STATE.PASS_THROUGH;
            if (!this.isFlac && this.hasID3) {
                newState = STATE.SCAN_MARKER;
            }
            else if (this.isFlac) {
                newState = STATE.MDB_HEADER;
            }
            this.state = newState;
        }
        else {
            chunk.done = true;
        }
    }
    processMDBHEADER(chunk) {
        if (this.safePush(chunk, 4, true, slice => this.validateMDBHeader(slice))) {
            this.state = STATE.MDB;
        }
        else {
            chunk.done = true;
        }
    }
    processMDB(chunk) {
        if (this.safePush(chunk, this.mdbLen, this.parseMetaDataBlocks, (slice, isDone) => this.validateMDB(slice, isDone))) {
            if (!this.mdb) {
                return;
            }
            if (this.mdb.isLast) {
                this.mdbLastWritten = true;
            }
            this.emit('postprocess', this.mdb);
            this.state = this.mdbLast ? STATE.PASS_THROUGH : STATE.MDB_HEADER;
        }
        else {
            chunk.done = true;
        }
    }
    processPASSTHROUGH(chunk) {
        this.safePush(chunk, chunk.length - chunk.pos, false, () => true);
        chunk.done = true;
    }
    process(chunk) {
        switch (this.state) {
            case STATE.IDLE: {
                this.processIDLE();
                break;
            }
            case STATE.SCAN_MARKER: {
                this.processSCANMARKER(chunk);
                break;
            }
            case STATE.MARKER: {
                this.processMARKER(chunk);
                break;
            }
            case STATE.MDB_HEADER: {
                this.processMDBHEADER(chunk);
                break;
            }
            case STATE.MDB: {
                this.processMDB(chunk);
                break;
            }
            default: {
                this.processPASSTHROUGH(chunk);
                break;
            }
        }
    }
    validateMarker(slice) {
        this.isFlac = (slice.toString('utf8', 0) === 'fLaC');
        if (!this.isFlac) {
            this.hasID3 = Buffer.from(slice.subarray(0, 3)).toString('utf8', 0) === 'ID3';
            if (!this.hasID3) {
                this.hasError = true;
                this.destroy(new Error('Not supported file format'));
            }
            return false;
        }
        return true;
    }
    initMDB(type) {
        switch (type) {
            case MDB_TYPE.STREAMINFO: {
                return new MetaDataBlockStreamInfo(this.mdbLast);
            }
            case MDB_TYPE.VORBIS_COMMENT: {
                return new BlockVorbiscomment(this.mdbLast);
            }
            case MDB_TYPE.PICTURE: {
                return new MetaDataBlockPicture(this.mdbLast);
            }
            default: {
                return new MetaDataBlock(this.mdbLast, type);
            }
        }
    }
    preProcess(slice, header) {
        if (!this.mdb) {
            return false;
        }
        if (this.mdbLastWritten) {
            this.mdb.remove();
        }
        else if (this.mdbLast !== this.mdb.isLast) {
            if (this.mdb.isLast) {
                header |= 2147483648;
            }
            else {
                header &= 2147483647;
            }
            slice.writeUInt32BE(header, 0);
        }
        this.mdbPush = !this.mdb.removed;
        return this.mdbPush;
    }
    validateMDBHeader(slice) {
        const header = slice.readUInt32BE(0);
        const type = (header >>> 24) & 0x7F;
        this.mdbLast = (((header >>> 24) & 0x80) !== 0);
        this.mdbLen = header & 16777215;
        this.mdb = this.initMDB(type);
        this.emit('preprocess', this.mdb);
        return this.preProcess(slice, header);
    }
    validateMDB(slice, isDone) {
        if (this.parseMetaDataBlocks && isDone) {
            if (!this.mdb) {
                return false;
            }
            this.mdb.parse(slice);
        }
        return this.mdbPush;
    }
}
//# sourceMappingURL=processor.js.map