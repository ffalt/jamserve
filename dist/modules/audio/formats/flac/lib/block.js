export class MetaDataBlock {
    constructor(isLast, type) {
        this.isLast = isLast;
        this.type = type;
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
//# sourceMappingURL=block.js.map