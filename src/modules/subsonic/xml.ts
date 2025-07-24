function xmlString(s: any): string {
	return s.toString()
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll('\'', '&apos;');
}

function xmlContent(o: any): string {
	for (const key of Object.keys(o)) {
		if (key === 'value') {
			return o[key];
		}
	}
	return '';
}

function xmlTag(key: string, val: string, parameter: string): string {
	return (val.length === 0) ? `<${key}${parameter} />` : `<${key}${parameter}>${val}</${key}>`;
}

function xmlParameters(o: any): string {
	const sl: Array<string> = [];
	for (const key of Object.keys(o)) {
		if ((key !== 'value')) {
			const sub = o[key];
			if (!Array.isArray(sub) && (typeof sub !== 'object')) {
				const val = JSON.stringify(sub);
				if (val !== undefined) {
					sl.push(` ${key}="${xmlString(sub)}"`);
				}
			}
		}
	}
	return sl.join('');
}

function xmlObject(o: any): string {
	const sl: Array<string> = [];
	for (const key of Object.keys(o)) {
		const sub = o[key];
		if (Array.isArray(sub)) {
			for (const entry of sub) {
				const val = xmlContent(entry) + xmlObject(entry);
				sl.push(xmlTag(key, val, xmlParameters(entry)));
			}
		} else if (typeof sub === 'object') {
			const val = xmlObject(sub);
			sl.push(xmlTag(key, val, xmlParameters(sub)));
		}
	}
	return sl.join('');
}

export function xml(o: any): string {
	const sl: Array<string> = [];
	for (const key of Object.keys(o)) {
		const val = xmlObject(o[key]);
		sl.push(xmlTag(key, val, xmlParameters(o[key])));
	}
	return `<?xml version="1.0" encoding="UTF-8"?>${sl.join('')}`;
}
