"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataBlockPicture = void 0;
const block_writeable_1 = require("./block.writeable");
class MetaDataBlockPicture extends block_writeable_1.MetaWriteableDataBlock {
    constructor(isLast) {
        super(isLast, 6);
        this.pictureType = 0;
        this.mimeType = '';
        this.description = '';
        this.width = 0;
        this.height = 0;
        this.bitsPerPixel = 0;
        this.colors = 0;
    }
    static createPictureBlock(pictureType, mimeType, description, width, height, bitsPerPixel, colors, pictureData) {
        const mdb = new MetaDataBlockPicture(false);
        mdb.pictureType = pictureType;
        mdb.mimeType = mimeType;
        mdb.description = description;
        mdb.width = width;
        mdb.height = height;
        mdb.bitsPerPixel = bitsPerPixel;
        mdb.colors = colors;
        mdb.pictureData = pictureData;
        mdb.hasData = true;
        return mdb;
    }
    parse(buffer) {
        try {
            let pos = 0;
            this.pictureType = buffer.readUInt32BE(pos);
            pos += 4;
            const mimeTypeLength = buffer.readUInt32BE(pos);
            this.mimeType = buffer.toString('utf8', pos + 4, pos + 4 + mimeTypeLength);
            pos += mimeTypeLength + 4;
            const descriptionLength = buffer.readUInt32BE(pos);
            this.description = buffer.toString('utf8', pos + 4, pos + 4 + descriptionLength);
            pos += descriptionLength + 4;
            this.width = buffer.readUInt32BE(pos);
            this.height = buffer.readUInt32BE(pos + 4);
            this.bitsPerPixel = buffer.readUInt32BE(pos + 8);
            this.colors = buffer.readUInt32BE(pos + 12);
            pos += 16;
            const pictureDataLength = buffer.readUInt32BE(pos);
            this.pictureData = Buffer.alloc(pictureDataLength);
            buffer.copy(this.pictureData, 0, pos + 4, pictureDataLength);
            this.hasData = true;
        }
        catch (e) {
            this.error = e;
            this.hasData = false;
        }
    }
    publish() {
        let pos = 0;
        const size = this.getSize();
        const buffer = Buffer.alloc(size + 4);
        if (this.pictureData) {
            let header = size;
            header |= (this.type << 24);
            header |= (this.isLast ? 0x80000000 : 0);
            header = header >>> 0;
            buffer.writeUInt32BE(header, pos);
            pos += 4;
            buffer.writeUInt32BE(this.pictureType, pos);
            pos += 4;
            const mimeTypeLen = Buffer.byteLength(this.mimeType);
            buffer.writeUInt32BE(mimeTypeLen, pos);
            buffer.write(this.mimeType, pos + 4);
            pos += mimeTypeLen + 4;
            const descriptionLen = Buffer.byteLength(this.description);
            buffer.writeUInt32BE(descriptionLen, pos);
            buffer.write(this.description, pos + 4);
            pos += descriptionLen + 4;
            buffer.writeUInt32BE(this.width, pos);
            buffer.writeUInt32BE(this.height, pos + 4);
            buffer.writeUInt32BE(this.bitsPerPixel, pos + 8);
            buffer.writeUInt32BE(this.colors, pos + 12);
            pos += 16;
            buffer.writeUInt32BE(this.pictureData.length, pos);
            this.pictureData.copy(buffer, pos + 4);
        }
        return buffer;
    }
    getSize() {
        return Buffer.byteLength(this.mimeType) + 4 +
            Buffer.byteLength(this.description) + 4 +
            +16
            + (this.pictureData ? this.pictureData.length : 0) + 4;
    }
}
exports.MetaDataBlockPicture = MetaDataBlockPicture;
//# sourceMappingURL=block.picture.js.map