import {MetaDataBlock} from './block';

export class MetaDataBlockStreamInfo extends MetaDataBlock {
	minBlockSize = 0;
	maxBlockSize = 0;
	minFrameSize = 0;
	maxFrameSize = 0;
	sampleRate = 0;
	channels = 0;
	bitsPerSample = 0;
	samples = 0;
	checksum?: Buffer;
	duration = 0;

	constructor(isLast: boolean) {
		super(isLast, 0);
	}

	remove(): void {
		console.error('WARNING: Can\'t remove StreamInfo block!');
	}

	parse(buffer: Buffer): void {
		try {
			const pos = 0;
			this.minBlockSize = buffer.readUInt16BE(pos);
			this.maxBlockSize = buffer.readUInt16BE(pos + 2);
			this.minFrameSize = (buffer.readUInt8(pos + 4) << 16) | buffer.readUInt16BE(pos + 5);
			this.maxFrameSize = (buffer.readUInt8(pos + 7) << 16) | buffer.readUInt16BE(pos + 8);
			const tmp = buffer.readUInt32BE(pos + 10);
			this.sampleRate = tmp >>> 12;
			this.channels = (tmp >>> 9) & 0x07;
			this.bitsPerSample = (tmp >>> 4) & 0x1f;
			this.samples = +((tmp & 0x0f) << 4) + buffer.readUInt32BE(pos + 14);
			this.checksum = Buffer.alloc(16);
			buffer.copy(this.checksum, 0, 18, 34);
			this.duration = this.samples / this.sampleRate;
			this.hasData = true;
		} catch (e) {
			this.error = e;
			this.hasData = false;
		}
	}

	// toString(): string {
	// 	let str = '[MetaDataBlockStreamInfo]';
	// 	str += ' type: ' + this.type;
	// 	str += ', isLast: ' + this.isLast;
	// 	if (this.error) {
	// 		str += '\n  ERROR: ' + this.error;
	// 	}
	// 	if (this.hasData) {
	// 		str += '\n  minBlockSize: ' + this.minBlockSize;
	// 		str += '\n  maxBlockSize: ' + this.maxBlockSize;
	// 		str += '\n  minFrameSize: ' + this.minFrameSize;
	// 		str += '\n  maxFrameSize: ' + this.maxFrameSize;
	// 		str += '\n  samples: ' + this.samples;
	// 		str += '\n  sampleRate: ' + this.sampleRate;
	// 		str += '\n  channels: ' + (this.channels + 1);
	// 		str += '\n  bitsPerSample: ' + (this.bitsPerSample + 1);
	// 		str += '\n  duration: ' + this.duration;
	// 		str += '\n  checksum: ' + (this.checksum ? this.checksum.toString('hex') : '<null>');
	// 	}
	// 	return str;
	// }
}
