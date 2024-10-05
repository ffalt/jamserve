function xmlString(s: any): string {
	return s.toString().replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
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
	Object.keys(o).forEach(key => {
		if ((key !== 'value')) {
			const sub = o[key];
			if (!Array.isArray(sub) && (typeof sub !== 'object')) {
				const val = JSON.stringify(sub);
				if (val !== undefined) {
					sl.push(` ${key}="${xmlString(sub)}"`);
				}
			}
		}
	});
	return sl.join('');
}

function xmlObject(o: any): string {
	const sl: Array<string> = [];
	Object.keys(o).forEach(key => {
		const sub = o[key];
		if (Array.isArray(sub)) {
			sub.forEach(entry => {
				const val = xmlContent(entry) + xmlObject(entry);
				sl.push(xmlTag(key, val, xmlParameters(entry)));
			});
		} else if (typeof sub === 'object') {
			const val = xmlObject(sub);
			sl.push(xmlTag(key, val, xmlParameters(sub)));
		}
	});
	return sl.join('');
}

export function xml(o: any): string {
	const sl: Array<string> = [];
	Object.keys(o).forEach(key => {
		const val = xmlObject(o[key]);
		sl.push(xmlTag(key, val, xmlParameters(o[key])));
	});
	return `<?xml version="1.0" encoding="UTF-8"?>${sl.join('')}`;
}
