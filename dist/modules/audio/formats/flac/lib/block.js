"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataBlock = void 0;
class MetaDataBlock {
    constructor(isLast, type) {
        this.isLast = isLast;
        this.type = type;
        this.hasData = false;
        this.removed = false;
        this.error = null;
        this.hasData = false;
        this.removed = false;
    }
    remove() {
        this.removed = true;
    }
    parse(_) {
    }
}
exports.MetaDataBlock = MetaDataBlock;
//# sourceMappingURL=block.js.map