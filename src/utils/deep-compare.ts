export function deepCompare(a: any, b: any, ignore?: Array<string>): boolean {
	const ignoreList: Array<string> = ignore || [];
	const compare = (oa: any, ob: any): boolean => {
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
	for (key in Object.keys(a)) {
		if (!ignoreList.includes(key)) {
			if (!compare(a[key], b[key])) {
				return false;
			}
		}
	}
	for (key in Object.keys(b)) {
		if (!ignoreList.includes(key)) {
			if (!compare(a[key], b[key])) {
				return false;
			}
		}
	}
	return true;
}
