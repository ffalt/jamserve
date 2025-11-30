function xmlString(s: string): string {
	return s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll('\'', '&apos;');
}

function xmlContent(o: Record<string, any>): string {
	for (const key of Object.keys(o)) {
		if (key === 'value') {
			return o[key] as string;
		}
	}
	return '';
}

function xmlTag(key: string, value: string, parameter: string): string {
	return (value.length === 0) ? `<${key}${parameter} />` : `<${key}${parameter}>${value}</${key}>`;
}

function xmlParameters(o: Record<string, any>): string {
	const sl: Array<string> = [];
	for (const key of Object.keys(o)) {
		if ((key !== 'value')) {
			const sub = o[key];
			if (sub !== undefined && !Array.isArray(sub) && (typeof sub !== 'object')) {
				sl.push(` ${key}="${xmlString((sub as string | number | boolean).toString())}"`);
			}
		}
	}
	return sl.join('');
}

function xmlObject(o: Record<string, any>): string {
	const sl: Array<string> = [];
	for (const key of Object.keys(o)) {
		const sub = o[key] as object | undefined;
		if (Array.isArray(sub)) {
			for (const entry of (sub as Array<Record<string, any>>)) {
				const value = xmlContent(entry) + xmlObject(entry);
				sl.push(xmlTag(key, value, xmlParameters(entry)));
			}
		} else if (typeof sub === 'object') {
			const value = xmlObject(sub as Record<string, any>);
			sl.push(xmlTag(key, value, xmlParameters(sub as Record<string, any>)));
		}
	}
	return sl.join('');
}

export function xml(o: Record<string, any>): string {
	const sl: Array<string> = [];
	for (const key of Object.keys(o)) {
		const element = o[key] as Record<string, any>;
		const value = xmlObject(element);
		sl.push(xmlTag(key, value, xmlParameters(element)));
	}
	return `<?xml version="1.0" encoding="UTF-8"?>${sl.join('')}`;
}
