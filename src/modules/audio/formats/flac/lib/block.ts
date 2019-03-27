export class MetaDataBlock {
	error: any;
	hasData = false;
	removed = false;

	constructor(public isLast: boolean, public type: number) {
		this.isLast = isLast;
		this.type = type;
		this.error = null;
		this.hasData = false;
		this.removed = false;
	}

	remove() {
		this.removed = true;
	}

	parse(buffer: Buffer) {
	}
}

export class MetaWriteableDataBlock extends MetaDataBlock {
	publish() {
	}
}

