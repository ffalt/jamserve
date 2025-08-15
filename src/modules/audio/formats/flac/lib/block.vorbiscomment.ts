import { MetaWriteableDataBlock } from './block.writeable.js';

export class BlockVorbiscomment extends MetaWriteableDataBlock {
	vendor = '';
	comments: Array<string> = [];

	constructor(isLast: boolean) {
		super(isLast, 4);
	}

	public static createVorbisCommentBlock(vendor: string, comments: Array<string>): BlockVorbiscomment {
		const mdb = new BlockVorbiscomment(false);
		mdb.vendor = vendor;
		mdb.comments = comments;
		mdb.hasData = true;
		return mdb;
	}

	parse(buffer: Buffer): void {
		try {
			let pos = 0;
			const vendorLength = buffer.readUInt32LE(pos);
			this.vendor = buffer.toString('utf8', pos + 4, pos + vendorLength + 4);
			pos += vendorLength + 4;
			let commentCount = buffer.readUInt32LE(pos);
			pos += 4;
			while (commentCount-- > 0) {
				const commentLength = buffer.readUInt32LE(pos);
				const comment = buffer.toString('utf8', pos + 4, pos + commentLength + 4);
				this.comments.push(comment);
				pos += commentLength + 4;
			}
			this.hasData = true;
		} catch (error: unknown) {
			this.error = error;
			this.hasData = false;
		}
	}

	publish(): Buffer {
		let pos = 0;
		const size = this.getSize();
		const buffer = Buffer.alloc(size + 4);

		let header = size;
		header |= (this.type << 24);
		header |= (this.isLast ? 0x80_00_00_00 : 0);
		buffer.writeUInt32BE(header, pos);
		pos += 4;

		const vendorLength = Buffer.byteLength(this.vendor);
		buffer.writeUInt32LE(vendorLength, pos);
		buffer.write(this.vendor, pos + 4);
		pos += vendorLength + 4;

		const commentCount = this.comments.length;
		buffer.writeUInt32LE(commentCount, pos);
		pos += 4;

		for (let index = 0; index < commentCount; index++) {
			const comment = this.comments[index];
			const commentLength = Buffer.byteLength(comment);
			buffer.writeUInt32LE(commentLength, pos);
			buffer.write(comment, pos + 4);
			pos += commentLength + 4;
		}

		return buffer;
	}

	getSize(): number {
		let size = Buffer.byteLength(this.vendor) + 8;
		for (const c of this.comments) {
			size += Buffer.byteLength(c) + 4;
		}
		return size;
	}
}
