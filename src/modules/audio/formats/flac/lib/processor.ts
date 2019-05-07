/***
 based on https://github.com/claus/flac-metadata
 License: MIT
 **/
import {Transform, TransformCallback, TransformOptions} from 'stream';
import {MetaDataBlock} from './block';
import {MetaDataBlockPicture} from './block.picture';
import {MetaDataBlockStreamInfo} from './block.streaminfo';
import {BlockVorbiscomment} from './block.vorbiscomment';

const STATE_IDLE = 0;
const STATE_MARKER = 1;
const STATE_MDB_HEADER = 2;
const STATE_MDB = 3;
const STATE_PASS_THROUGH = 4;
const STATE_SCAN_MARKER = 5;

export const MDB_TYPE_STREAMINFO = 0;
export const MDB_TYPE_PADDING = 1;
export const MDB_TYPE_APPLICATION = 2;
export const MDB_TYPE_SEEKTABLE = 3;
export const MDB_TYPE_VORBIS_COMMENT = 4;
export const MDB_TYPE_CUESHEET = 5;
export const MDB_TYPE_PICTURE = 6;
export const MDB_TYPE_INVALID = 127;

export class FlacProcessorStream extends Transform {
	state = STATE_IDLE;
	hasError = false;
	hasID3 = false;
	isFlac = false;
	buf?: Buffer;
	bufPos = 0;

	mdb: any;
	mdbLen = 0;
	mdbLast = false;
	mdbPush = false;
	mdbLastWritten = false;

	parseMetaDataBlocks = true;
	reportID3 = true;

	constructor(reportID3: boolean = false, parseMetaDataBlocks: boolean = false, options?: TransformOptions) {
		super(options);
		this.reportID3 = !!reportID3;
		this.parseMetaDataBlocks = !!parseMetaDataBlocks;
	}

	_transform(chunk: any, encoding: string, callback: TransformCallback): void {
		let chunkPos = 0;
		const chunkLen = chunk.length;
		let isChunkProcessed = false;

		const scan = () => {
			for (let i = chunkPos; i < chunkLen; i++) {
				const slice = chunk.slice(i, i + 4).toString('utf8', 0);
				if (slice === 'fLaC') {
					if (this.reportID3) {
						let rest = chunk.slice(0, i);
						if (this.buf) {
							rest = Buffer.concat([this.buf, rest]);
						}
						this.emit('id3', rest);
					}
					this.isFlac = true;
					chunkPos = i;
					this.bufPos = 0;
					this.buf = undefined;
					return;
				}
			}
			if (this.reportID3) {
				this.buf = !this.buf ? chunk : Buffer.concat([this.buf, chunk]);
			}
		};

		const safePush = (minCapacity: number, persist: boolean, validate?: (slice: Buffer, isDone: boolean) => boolean) => {
			let slice;
			const chunkAvailable = chunkLen - chunkPos;
			const isDone = (chunkAvailable + this.bufPos >= minCapacity);
			const _validate = (typeof validate === 'function') ? validate : () => true;
			if (isDone) {
				// Enough data available
				if (persist) {
					// Persist the entire block so it can be parsed
					if (this.bufPos > 0 && this.buf) {
						// Part of this block's data is in backup buffer, copy rest over
						chunk.copy(this.buf, this.bufPos, chunkPos, chunkPos + minCapacity - this.bufPos);
						slice = this.buf.slice(0, minCapacity);
					} else {
						// Entire block fits in current chunk
						slice = chunk.slice(chunkPos, chunkPos + minCapacity);
					}
				} else {
					slice = chunk.slice(chunkPos, chunkPos + minCapacity - this.bufPos);
				}
				// Push block after validation
				if (_validate(slice, isDone)) {
					this.push(slice);
				}
				chunkPos += minCapacity - this.bufPos;
				this.bufPos = 0;
				this.buf = undefined;
			} else {
				// Not enough data available
				if (persist) {
					// Copy/append incomplete block to backup buffer
					this.buf = this.buf || Buffer.alloc(minCapacity);
					chunk.copy(this.buf, this.bufPos, chunkPos, chunkLen);
				} else {
					// Push incomplete block after validation
					slice = chunk.slice(chunkPos, chunkLen);
					if (_validate(slice, isDone)) {
						this.push(slice);
					}
				}
				this.bufPos += chunkLen - chunkPos;
			}
			return isDone;
		};

		while (!isChunkProcessed) {
			switch (this.state) {
				case STATE_IDLE:
					this.state = STATE_MARKER;
					break;
				case STATE_SCAN_MARKER:
					scan();
					if (this.isFlac) {
						this.state = STATE_MARKER;
					} else {
						isChunkProcessed = true;
					}
					break;
				case STATE_MARKER:
					if (safePush(4, true, this._validateMarker.bind(this))) {
						this.state = (!this.isFlac && this.hasID3) ?
							STATE_SCAN_MARKER :
							(this.isFlac ? STATE_MDB_HEADER : STATE_PASS_THROUGH);
					} else {
						isChunkProcessed = true;
					}
					break;
				case STATE_MDB_HEADER:
					if (safePush(4, true, this._validateMDBHeader.bind(this))) {
						this.state = STATE_MDB;
					} else {
						isChunkProcessed = true;
					}
					break;
				case STATE_MDB:
					if (safePush(this.mdbLen, this.parseMetaDataBlocks, this._validateMDB.bind(this))) {
						if (this.mdb.isLast) {
							// This MDB has the isLast flag set to true.
							// Ignore all following MDBs.
							this.mdbLastWritten = true;
						}
						this.emit('postprocess', this.mdb);
						this.state = this.mdbLast ? STATE_PASS_THROUGH : STATE_MDB_HEADER;
					} else {
						isChunkProcessed = true;
					}
					break;
				case STATE_PASS_THROUGH:
					safePush(chunkLen - chunkPos, false);
					isChunkProcessed = true;
					break;
			}
		}
		if (!this.hasError) {
			this.emit('done');
		}
		callback();
	}

	_validateMarker(slice: Buffer, isDone: boolean): boolean {
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

	_validateMDBHeader(slice: Buffer, isDone: boolean): boolean {
		// Parse MDB header
		let header = slice.readUInt32BE(0);
		const type = (header >>> 24) & 0x7f;
		this.mdbLast = (((header >>> 24) & 0x80) !== 0);
		this.mdbLen = header & 0xffffff;

		// Create appropriate MDB object
		// (data is injected later in _validateMDB, if parseMetaDataBlocks option is set to true)
		switch (type) {
			case MDB_TYPE_STREAMINFO:
				this.mdb = new MetaDataBlockStreamInfo(this.mdbLast);
				break;
			case MDB_TYPE_VORBIS_COMMENT:
				this.mdb = new BlockVorbiscomment(this.mdbLast);
				break;
			case MDB_TYPE_PICTURE:
				this.mdb = new MetaDataBlockPicture(this.mdbLast);
				break;
			// case MDB_TYPE_PADDING:
			// case MDB_TYPE_APPLICATION:
			// case MDB_TYPE_SEEKTABLE:
			// case MDB_TYPE_CUESHEET:
			// case MDB_TYPE_INVALID:
			default:
				this.mdb = new MetaDataBlock(this.mdbLast, type);
				break;
		}

		this.emit('preprocess', this.mdb);

		if (this.mdbLastWritten) {
			// A previous MDB had the isLast flag set to true.
			// Ignore all following MDBs.
			this.mdb.remove();
		} else {
			// The consumer may change the MDB's isLast flag in the preprocess handler.
			// Here that flag is updated in the MDB header.
			if (this.mdbLast !== this.mdb.isLast) {
				if (this.mdb.isLast) {
					header |= 0x80000000;
				} else {
					header &= 0x7fffffff;
				}
				slice.writeUInt32BE(header >>> 0, 0);
			}
		}
		this.mdbPush = !this.mdb.removed;
		return this.mdbPush;
	}

	_validateMDB(slice: Buffer, isDone: boolean): boolean {
		// Parse the MDB if parseMetaDataBlocks option is set to true
		if (this.parseMetaDataBlocks && isDone) {
			this.mdb.parse(slice);
		}
		return this.mdbPush;
	}

	_flush(callback: TransformCallback): void {
		// All chunks have been processed
		// Clean up
		this.state = STATE_IDLE;
		this.mdbLastWritten = false;
		this.hasID3 = false;
		this.isFlac = false;
		this.bufPos = 0;
		this.buf = undefined;
		this.mdb = null;
		callback();
	}

}
