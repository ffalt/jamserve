function xmlString(s: string): string {
	return s
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll('\'', '&apos;');
}

function xmlContent(o: Record<string, any>): string {
	for (const [key, value] of Object.entries(o)) {
		if (key === 'value') {
			return value as string;
		}
	}
	return '';
}

function xmlTag(key: string, value: string, parameter: string): string {
	return (value.length === 0) ? `<${key}${parameter} />` : `<${key}${parameter}>${value}</${key}>`;
}

function xmlParameters(o: Record<string, any>): string {
	const sl: Array<string> = [];
	for (const [key, sub] of Object.entries(o)) {
		if (key === 'value') {
			continue;
		}

		if (sub !== undefined && (typeof sub !== 'object') && !Array.isArray(sub)) {
			sl.push(` ${key}="${xmlString((sub as string | number | boolean).toString())}"`);
		}
	}
	return sl.join('');
}

function xmlObject(o: Record<string, any>): string {
	const sl: Array<string> = [];
	for (const [key, sub] of Object.entries(o) as Array<[string, object | undefined]>) {
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
	for (const [key, element] of Object.entries(o) as Array<[string, Record<string, any>]>) {
		const value = xmlObject(element);
		sl.push(xmlTag(key, value, xmlParameters(element)));
	}
	return `<?xml version="1.0" encoding="UTF-8"?>${sl.join('')}`;
}
