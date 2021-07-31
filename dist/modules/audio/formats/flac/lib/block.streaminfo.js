import { MetaDataBlock } from './block';
export class MetaDataBlockStreamInfo extends MetaDataBlock {
    constructor(isLast) {
        super(isLast, 0);
        this.minBlockSize = 0;
        this.maxBlockSize = 0;
        this.minFrameSize = 0;
        this.maxFrameSize = 0;
        this.sampleRate = 0;
        this.channels = 0;
        this.bitsPerSample = 0;
        this.samples = 0;
        this.duration = 0;
    }
    remove() {
        throw Error('Can\'t remove StreamInfo block!');
    }
    parse(buffer) {
        try {
            const pos = 0;
            this.minBlockSize = buffer.readUInt16BE(pos);
            this.maxBlockSize = buffer.readUInt16BE(pos + 2);
            this.minFrameSize = (buffer.readUInt8(pos + 4) << 16) | buffer.readUInt16BE(pos + 5);
            this.maxFrameSize = (buffer.readUInt8(pos + 7) << 16) | buffer.readUInt16BE(pos + 8);
            const tmp = buffer.readUInt32BE(pos + 10);
            this.sampleRate = tmp >>> 12;
            this.channels = (tmp >>> 9) & 0x07;
            this.bitsPerSample = (tmp >>> 4) & 0x1F;
            this.samples = +((tmp & 0x0F) << 4) + buffer.readUInt32BE(pos + 14);
            this.checksum = Buffer.alloc(16);
            buffer.copy(this.checksum, 0, 18, 34);
            this.duration = this.samples / this.sampleRate;
            this.hasData = true;
        }
        catch (e) {
            this.error = e;
            this.hasData = false;
        }
    }
}
//# sourceMappingURL=block.streaminfo.js.map