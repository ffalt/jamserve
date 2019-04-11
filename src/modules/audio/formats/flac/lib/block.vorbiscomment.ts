import {MetaWriteableDataBlock} from './block';

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

	parse(buffer: Buffer) {
		try {
			let pos = 0;
			const vendorLen = buffer.readUInt32LE(pos);
			const vendor = buffer.toString('utf8', pos + 4, pos + 4 + vendorLen);
			this.vendor = vendor;
			pos += 4 + vendorLen;
			let commentCount = buffer.readUInt32LE(pos);
			pos += 4;
			while (commentCount-- > 0) {
				const commentLen = buffer.readUInt32LE(pos);
				const comment = buffer.toString('utf8', pos + 4, pos + 4 + commentLen);
				this.comments.push(comment);
				pos += 4 + commentLen;
			}
			this.hasData = true;
		} catch (e) {
			this.error = e;
			this.hasData = false;
		}
	}

	publish() {
		let pos = 0;
		const size = this.getSize();
		const buffer = Buffer.alloc(4 + size);

		let header = size;
		header |= (this.type << 24);
		header |= (this.isLast ? 0x80000000 : 0);
		buffer.writeUInt32BE(header >>> 0, pos);
		pos += 4;

		const vendorLen = Buffer.byteLength(this.vendor);
		buffer.writeUInt32LE(vendorLen, pos);
		buffer.write(this.vendor, pos + 4);
		pos += 4 + vendorLen;

		const commentCount = this.comments.length;
		buffer.writeUInt32LE(commentCount, pos);
		pos += 4;

		for (let i = 0; i < commentCount; i++) {
			const comment = this.comments[i];
			const commentLen = Buffer.byteLength(comment);
			buffer.writeUInt32LE(commentLen, pos);
			buffer.write(comment, pos + 4);
			pos += 4 + commentLen;
		}

		return buffer;
	}

	getSize(): number {
		let size = 8 + Buffer.byteLength(this.vendor);
		for (let i = 0; i < this.comments.length; i++) {
			size += 4 + Buffer.byteLength(this.comments[i]);
		}
		return size;
	}

	// toString(): string {
	// 	let str = '[MetaDataBlockVorbisComment]';
	// 	str += ' type: ' + this.type;
	// 	str += ', isLast: ' + this.isLast;
	// 	if (this.error) {
	// 		str += '\n  ERROR: ' + this.error;
	// 	}
	// 	if (this.hasData) {
	// 		str += '\n  vendor: ' + this.vendor;
	// 		if (this.comments.length) {
	// 			str += '\n  comments:';
	// 			for (let i = 0; i < this.comments.length; i++) {
	// 				str += '\n    ' + this.comments[i].split('=').join(': ');
	// 			}
	// 		} else {
	// 			str += '\n  comments: none';
	// 		}
	// 	}
	// 	return str;
	// }
}
