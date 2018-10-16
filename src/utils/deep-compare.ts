export function deepCompare(a: any, b: any, ignore?: Array<string>): boolean {
	const ignoreList: Array<string> = ignore || [];
	const compare = (oa: any, ob: any) => {
		if (a === undefined) {
			return false;
		}
		if (b === undefined) {
			return false;
		}
		if (typeof oa === 'object') {
			if (!deepCompare(oa, ob, ignore)) {
				return false;
			}
		} else if (oa !== ob) {
			return false;
		}
		return true;
	};
	if (a === undefined) {
		return false;
	}
	if (b === undefined) {
		return false;
	}
	let key;
	for (key in a) {
		if (a.hasOwnProperty(key) && ignoreList.indexOf(key) < 0) {
			if (!compare(a[key], b[key])) {
				return false;
			}
		}
	}
	for (key in b) {
		if (b.hasOwnProperty(key) && ignoreList.indexOf(key) < 0) {
			if (!compare(a[key], b[key])) {
				return false;
			}
		}
	}
	return true;
}
