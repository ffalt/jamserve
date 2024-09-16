import { Transform } from 'stream';
import { MetaDataBlock } from './block.js';
import { MetaDataBlockPicture } from './block.picture.js';
import { MetaDataBlockStreamInfo } from './block.streaminfo.js';
import { BlockVorbiscomment } from './block.vorbiscomment.js';
export class FlacProcessorStream extends Transform {
    constructor(reportID3 = false, parseMetaDataBlocks = false, options) {
        super(options);
        this.reportID3 = reportID3;
        this.parseMetaDataBlocks = parseMetaDataBlocks;
        this.hasError = false;
        this.hasID3 = false;
        this.isFlac = false;
        this.state = 0;
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
        if (!this.hasError) {
            this.emit('done');
        }
        callback();
    }
    _flush(callback) {
        this.state = 0;
        this.mdbLastWritten = false;
        this.hasID3 = false;
        this.isFlac = false;
        this.bufPos = 0;
        this.buf = undefined;
        this.mdb = null;
        callback();
    }
    scanSetFlac(chunk, pos) {
        if (this.reportID3) {
            let rest = chunk.buffer.slice(0, pos);
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
        for (let i = chunk.pos; i < chunk.length; i++) {
            const slice = chunk.buffer.slice(i, i + 4).toString('utf8', 0);
            if (slice === 'fLaC') {
                this.scanSetFlac(chunk, i);
                return;
            }
        }
        if (this.reportID3) {
            this.buf = !this.buf ? chunk.buffer : Buffer.concat([this.buf, chunk.buffer]);
        }
    }
    safePushFull(chunk, minCapacity, persist, validate) {
        let slice;
        if (persist) {
            if (this.bufPos > 0 && this.buf) {
                chunk.buffer.copy(this.buf, this.bufPos, chunk.pos, chunk.pos + minCapacity - this.bufPos);
                slice = this.buf.slice(0, minCapacity);
            }
            else {
                slice = chunk.buffer.slice(chunk.pos, chunk.pos + minCapacity);
            }
        }
        else {
            slice = chunk.buffer.slice(chunk.pos, chunk.pos + minCapacity - this.bufPos);
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
            this.buf = this.buf || Buffer.alloc(minCapacity);
            chunk.buffer.copy(this.buf, this.bufPos, chunk.pos, chunk.length);
        }
        else {
            const slice = chunk.buffer.slice(chunk.pos, chunk.length);
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
        this.state = 1;
    }
    processSCANMARKER(chunk) {
        this.scan(chunk);
        if (this.isFlac) {
            this.state = 1;
        }
        else {
            chunk.done = true;
        }
    }
    processMARKER(chunk) {
        if (this.safePush(chunk, 4, true, slice => this.validateMarker(slice))) {
            this.state = (!this.isFlac && this.hasID3) ?
                5 :
                (this.isFlac ? 2 : 4);
        }
        else {
            chunk.done = true;
        }
    }
    processMDBHEADER(chunk) {
        if (this.safePush(chunk, 4, true, slice => this.validateMDBHeader(slice))) {
            this.state = 3;
        }
        else {
            chunk.done = true;
        }
    }
    processMDB(chunk) {
        if (this.safePush(chunk, this.mdbLen, this.parseMetaDataBlocks, (slice, isDone) => this.validateMDB(slice, isDone))) {
            if (this.mdb.isLast) {
                this.mdbLastWritten = true;
            }
            this.emit('postprocess', this.mdb);
            this.state = this.mdbLast ? 4 : 2;
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
            case 0:
                this.processIDLE();
                break;
            case 5:
                this.processSCANMARKER(chunk);
                break;
            case 1:
                this.processMARKER(chunk);
                break;
            case 2:
                this.processMDBHEADER(chunk);
                break;
            case 3:
                this.processMDB(chunk);
                break;
            default:
            case 4:
                this.processPASSTHROUGH(chunk);
                break;
        }
    }
    validateMarker(slice) {
        this.isFlac = (slice.toString('utf8', 0) === 'fLaC');
        if (!this.isFlac) {
            this.hasID3 = slice.slice(0, 3).toString('utf8', 0) === 'ID3';
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
            case 0:
                return new MetaDataBlockStreamInfo(this.mdbLast);
            case 4:
                return new BlockVorbiscomment(this.mdbLast);
            case 6:
                return new MetaDataBlockPicture(this.mdbLast);
            default:
                return new MetaDataBlock(this.mdbLast, type);
        }
    }
    preProcess(slice, header) {
        if (this.mdbLastWritten) {
            this.mdb.remove();
        }
        else if (this.mdbLast !== this.mdb.isLast) {
            if (this.mdb.isLast) {
                header |= 0x80000000;
            }
            else {
                header &= 0x7FFFFFFF;
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
        this.mdbLen = header & 0xFFFFFF;
        this.mdb = this.initMDB(type);
        this.emit('preprocess', this.mdb);
        return this.preProcess(slice, header);
    }
    validateMDB(slice, isDone) {
        if (this.parseMetaDataBlocks && isDone) {
            this.mdb.parse(slice);
        }
        return this.mdbPush;
    }
}
//# sourceMappingURL=processor.js.map