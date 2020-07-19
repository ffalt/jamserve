export class MetaDataBlock {
	error: any;
	hasData = false;
	removed = false;

	constructor(public isLast: boolean, public type: number) {
		this.error = null;
		this.hasData = false;
		this.removed = false;
	}

	remove(): void {
		this.removed = true;
	}

	parse(_: Buffer): void {
		// nope
	}
}
