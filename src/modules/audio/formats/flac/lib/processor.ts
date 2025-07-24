/***
 based on https://github.com/claus/flac-metadata
 License: MIT
 **/

import { Transform, TransformCallback, TransformOptions } from 'node:stream';
import { MetaDataBlock } from './block.js';
import { MetaDataBlockPicture } from './block.picture.js';
import { MetaDataBlockStreamInfo } from './block.streaminfo.js';
import { BlockVorbiscomment } from './block.vorbiscomment.js';

const enum STATE {
	IDLE = 0,
	MARKER = 1,
	MDB_HEADER = 2,
	MDB = 3,
	PASS_THROUGH = 4,
	SCAN_MARKER = 5
}

export const enum MDB_TYPE {
	STREAMINFO = 0,
	PADDING = 1,
	APPLICATION = 2,
	SEEKTABLE = 3,
	VORBIS_COMMENT = 4,
	CUESHEET = 5,
	PICTURE = 6,
	INVALID = 127
}

interface Chunk {
	buffer: Buffer;
	pos: number;
	length: number;
	done: boolean;
}

export class FlacProcessorStream extends Transform {
	private hasError = false;
	private hasID3 = false;
	private isFlac = false;
	private state = STATE.IDLE;
	private buf?: Buffer;
	private bufPos = 0;

	private mdb: any;
	private mdbLen = 0;
	private mdbLast = false;
	private mdbPush = false;
	private mdbLastWritten = false;

	constructor(
		private readonly reportID3: boolean = false,
		private readonly parseMetaDataBlocks: boolean = false,
		options?: TransformOptions
	) {
		super(options);
	}

	_transform(buffer: any, _encoding: string, callback: TransformCallback): void {
		const chunk: Chunk = { buffer, pos: 0, length: buffer.length, done: false };
		while (!chunk.done) {
			this.process(chunk);
		}
		if (!this.hasError) {
			this.emit('done');
		}
		callback();
	}

	_flush(callback: TransformCallback): void {
		// All chunks have been processed
		// Clean up
		this.state = STATE.IDLE;
		this.mdbLastWritten = false;
		this.hasID3 = false;
		this.isFlac = false;
		this.bufPos = 0;
		this.buf = undefined;
		this.mdb = null;
		callback();
	}

	private scanSetFlac(chunk: Chunk, pos: number): void {
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

	private scan(chunk: Chunk): void {
		for (let i = chunk.pos; i < chunk.length; i++) {
			const slice = Buffer.from(chunk.buffer.subarray(i, i + 4)).toString('utf8', 0);
			if (slice === 'fLaC') {
				this.scanSetFlac(chunk, i);
				return;
			}
		}
		if (this.reportID3) {
			this.buf = this.buf ? Buffer.concat([this.buf, chunk.buffer]) : chunk.buffer;
		}
	}

	private safePushFull(chunk: Chunk, minCapacity: number, persist: boolean, validate: (slice: Buffer, isDone: boolean) => boolean): void {
		let slice;
		// Enough data available
		if (persist) {
			// Persist the entire block so it can be parsed
			if (this.bufPos > 0 && this.buf) {
				// Part of this block's data is in backup buffer, copy rest over
				chunk.buffer.copy(this.buf, this.bufPos, chunk.pos, chunk.pos + minCapacity - this.bufPos);
				slice = Buffer.from(this.buf.subarray(0, minCapacity));
			} else {
				// Entire block fits in current chunk
				slice = Buffer.from(chunk.buffer.subarray(chunk.pos, chunk.pos + minCapacity));
			}
		} else {
			slice = Buffer.from(chunk.buffer.subarray(chunk.pos, chunk.pos + minCapacity - this.bufPos));
		}
		// Push block after validation
		if (validate(slice, true)) {
			this.push(slice);
		}
		chunk.pos += minCapacity - this.bufPos;
		this.bufPos = 0;
		this.buf = undefined;
	}

	private safePushIncomplete(chunk: Chunk, minCapacity: number, persist: boolean, validate: (slice: Buffer, isDone: boolean) => boolean): void {
		// Not enough data available
		if (persist) {
			// Copy/append incomplete block to backup buffer
			this.buf = this.buf || Buffer.alloc(minCapacity);
			chunk.buffer.copy(this.buf, this.bufPos, chunk.pos, chunk.length);
		} else {
			// Push incomplete block after validation
			const slice = Buffer.from(chunk.buffer.subarray(chunk.pos, chunk.length));
			if (validate(slice, false)) {
				this.push(slice);
			}
		}
		this.bufPos += chunk.length - chunk.pos;
	}

	private safePush(chunk: Chunk, minCapacity: number, persist: boolean, validate: (slice: Buffer, isDone: boolean) => boolean): boolean {
		const isDone = (chunk.length - chunk.pos + this.bufPos >= minCapacity);
		if (isDone) {
			this.safePushFull(chunk, minCapacity, persist, validate);
		} else {
			this.safePushIncomplete(chunk, minCapacity, persist, validate);
		}
		return isDone;
	}

	private processIDLE(): void {
		this.state = STATE.MARKER;
	}

	private processSCANMARKER(chunk: Chunk): void {
		this.scan(chunk);
		if (this.isFlac) {
			this.state = STATE.MARKER;
		} else {
			chunk.done = true;
		}
	}

	private processMARKER(chunk: Chunk): void {
		if (this.safePush(chunk, 4, true, slice => this.validateMarker(slice))) {
			let newState: STATE = STATE.PASS_THROUGH;
			if (!this.isFlac && this.hasID3) {
				newState = STATE.SCAN_MARKER;
			} else if (this.isFlac) {
				newState = STATE.MDB_HEADER;
			}
			this.state = newState;
		} else {
			chunk.done = true;
		}
	}

	private processMDBHEADER(chunk: Chunk): void {
		if (this.safePush(chunk, 4, true, slice => this.validateMDBHeader(slice))) {
			this.state = STATE.MDB;
		} else {
			chunk.done = true;
		}
	}

	private processMDB(chunk: Chunk): void {
		if (this.safePush(chunk, this.mdbLen, this.parseMetaDataBlocks, (slice, isDone) => this.validateMDB(slice, isDone))) {
			if (this.mdb.isLast) {
				// This MDB has the isLast flag set to true.
				// Ignore all following MDBs.
				this.mdbLastWritten = true;
			}
			this.emit('postprocess', this.mdb);
			this.state = this.mdbLast ? STATE.PASS_THROUGH : STATE.MDB_HEADER;
		} else {
			chunk.done = true;
		}
	}

	private processPASSTHROUGH(chunk: Chunk): void {
		this.safePush(chunk, chunk.length - chunk.pos, false, () => true);
		chunk.done = true;
	}

	private process(chunk: Chunk): void {
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
			// case STATE.PASS_THROUGH:
			default: {
				this.processPASSTHROUGH(chunk);
				break;
			}
		}
	}

	private validateMarker(slice: Buffer): boolean {
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

	private initMDB(type: MDB_TYPE): MetaDataBlock {
		// Create appropriate MDB object
		// (data is injected later in _validateMDB, if parseMetaDataBlocks option is set to true)
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
			// case MDB_TYPE.PADDING:
			// case MDB_TYPE.APPLICATION:
			// case MDB_TYPE.SEEKTABLE:
			// case MDB_TYPE.CUESHEET:
			// case MDB_TYPE.INVALID:
			default: {
				return new MetaDataBlock(this.mdbLast, type);
			}
		}
	}

	private preProcess(slice: Buffer, header: number): boolean {
		if (this.mdbLastWritten) {
			// A previous MDB had the isLast flag set to true.
			// Ignore all following MDBs.
			this.mdb.remove();
		} else if (this.mdbLast !== this.mdb.isLast) {
			// The consumer may change the MDB's isLast flag in the preprocess handler.
			// Here that flag is updated in the MDB header.
			if (this.mdb.isLast) {
				header |= 0x80_00_00_00;
			} else {
				header &= 0x7F_FF_FF_FF;
			}
			slice.writeUInt32BE(header, 0);
		}
		this.mdbPush = !this.mdb.removed;
		return this.mdbPush;
	}

	private validateMDBHeader(slice: Buffer): boolean {
		// Parse MDB header
		const header = slice.readUInt32BE(0);
		const type = (header >>> 24) & 0x7F;
		this.mdbLast = (((header >>> 24) & 0x80) !== 0);
		this.mdbLen = header & 0xFF_FF_FF;
		this.mdb = this.initMDB(type);
		this.emit('preprocess', this.mdb);
		return this.preProcess(slice, header);
	}

	private validateMDB(slice: Buffer, isDone: boolean): boolean {
		// Parse the MDB if parseMetaDataBlocks option is set to true
		if (this.parseMetaDataBlocks && isDone) {
			this.mdb.parse(slice);
		}
		return this.mdbPush;
	}
}
