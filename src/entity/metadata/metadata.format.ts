import {ExtendedInfo} from './metadata.model';

export class MetaDataFormat {

	static stripInlineLastFM(content: string): string {
		return (content || '').replace(/<a href=".*">Read more on Last\.fm<\/a>\.?/g, '')
			.replace(/<a .* href=".*">Read more on Last\.fm<\/a>\.?/g, '')
			.replace('User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.', '');
	}

	static stripInlineWikipediaHTML(content: string): string {
		return (content || '')
			.replace(/<p class="mw-empty-elt">\s*<\/p>/g, '')
			.replace(/<p>/g, '')
			.replace(/<\/p>/g, '\n');
	}

	static formatWikipediaExtendedInfo(url: string, description: string): ExtendedInfo {
		return {
			url,
			description: MetaDataFormat.stripInlineWikipediaHTML(description),
			source: 'Wikipedia',
			license: 'Creative Commons BY-SA license',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
		};
	}

	static formatLastFMExtendedInfo(url: string, description: string): ExtendedInfo {
		return {
			url,
			description: MetaDataFormat.stripInlineLastFM(description),
			source: 'LastFM',
			license: 'Creative Commons BY-SA license',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
		};
	}

}
