
export function hexEncode(n: string): string {
	const i: Array<string> = [];
	const r: Array<string> = [];
	const u = '0123456789abcdef';
	for (let t = 0; t < 256; t++) {
		/* tslint:disable */
		i[t] = u.charAt(t >> 4) + u.charAt(t & 15);
		/* tslint:enable */
	}
	for (let t = 0; t < n.length; t++) {
		r[t] = i[n.charCodeAt(t)];
	}
	return r.join('');
}

export function hexDecode(hex: string): string {
	let str = '';
	for (let i = 0; i < hex.length; i += 2) {
		str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	}
	return str.trim();
}
