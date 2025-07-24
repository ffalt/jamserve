export class MetaDataBlock {
	error: any = null;
	hasData: boolean = false;
	removed: boolean = false;

	constructor(public isLast: boolean, public type: number) {
	}

	remove(): void {
		this.removed = true;
	}

	parse(_: Buffer): void {
		// nope
	}
}
