import util from 'util';

export function toXML(obj: any): string {

	const xmls = (s: any): string => s.toString().replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

	const xmli = (o: any) => {
		let s = '';
		Object.keys(o).forEach(key => {
			if ((key !== 'content')) {
				const sub = o[key];
				if (!util.isArray(sub) && (typeof sub !== 'object')) {
					const val = JSON.stringify(sub);
					if (val !== undefined) {
						s += ' ' + key + '="' + xmls(sub) + '"';
					}
				}
			}
		});
		return s;
	};

	const xmlc = (o: any): string => {
		for (const key in o) {
			if (key === 'content' && o.hasOwnProperty(key)) {
				return o[key];
			}
		}
		return '';
	};

	const xmlo = (o: any): string => {
		let s = '';
		Object.keys(o).forEach(key => {
			const sub = o[key];
			if (util.isArray(sub)) {
				sub.forEach((entry) => {
					const val = xmlc(entry) + xmlo(entry);
					s += '<' + key + xmli(entry);
					if (val.length > 0) {
						s += '>' + val + '</' + key + '>';
					} else {
						s += ' />';
					}
				});
			} else if (typeof sub === 'object') {
				const val = xmlo(sub);
				s += '<' + key + xmli(sub);
				if (val.length > 0) {
					s += '>' + val + '</' + key + '>';
				} else {
					s += ' />';
				}
			}
		});
		return s;
	};

	const xml = (o: any): string => {
		let s = '';
		Object.keys(o).forEach(key => {
			const val = xmlo(o[key]);
			s += '<' + key + xmli(o[key]);
			if (val.length > 0) {
				s += '>' + val + '</' + key + '>';
			} else {
				s += ' />';
			}
		});
		return '<?xml version="1.0" encoding="UTF-8"?>' + s;
	};

	return xml(obj);
}
