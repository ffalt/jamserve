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
			const vendorLen = buffer.readUInt32LE(pos);
			this.vendor = buffer.toString('utf8', pos + 4, pos + vendorLen + 4);
			pos += vendorLen + 4;
			let commentCount = buffer.readUInt32LE(pos);
			pos += 4;
			while (commentCount-- > 0) {
				const commentLen = buffer.readUInt32LE(pos);
				const comment = buffer.toString('utf8', pos + 4, pos + commentLen + 4);
				this.comments.push(comment);
				pos += commentLen + 4;
			}
			this.hasData = true;
		} catch (e: any) {
			this.error = e;
			this.hasData = false;
		}
	}

	publish(): Buffer {
		let pos = 0;
		const size = this.getSize();
		const buffer = Buffer.alloc(size + 4);

		let header = size;
		header |= (this.type << 24);
		header |= (this.isLast ? 0x80000000 : 0);
		buffer.writeUInt32BE(header, pos);
		pos += 4;

		const vendorLen = Buffer.byteLength(this.vendor);
		buffer.writeUInt32LE(vendorLen, pos);
		buffer.write(this.vendor, pos + 4);
		pos += vendorLen + 4;

		const commentCount = this.comments.length;
		buffer.writeUInt32LE(commentCount, pos);
		pos += 4;

		for (let i = 0; i < commentCount; i++) {
			const comment = this.comments[i];
			const commentLen = Buffer.byteLength(comment);
			buffer.writeUInt32LE(commentLen, pos);
			buffer.write(comment, pos + 4);
			pos += commentLen + 4;
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
