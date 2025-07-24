import { ExtendedInfo } from './metadata.model.js';

export const MetaDataFormat = {
	stripInlineLastFM(content: string): string {
		return (content || '')
			.replaceAll(/<a href=".*">Read more on Last\.fm<\/a>\.?/g, '')
			.replaceAll(/<a .* href=".*">Read more on Last\.fm<\/a>\.?/g, '')
			.replaceAll('User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.', '');
	},

	stripInlineWikipediaHTML(content: string): string {
		return (content || '')
			.replaceAll(/<p class="mw-empty-elt">\s*<\/p>/g, '')
			.replaceAll('<p>', '')
			.replaceAll('</p>', '\n');
	},

	formatWikipediaExtendedInfo(url: string, description: string): ExtendedInfo {
		return {
			url,
			description: MetaDataFormat.stripInlineWikipediaHTML(description),
			source: 'Wikipedia',
			license: 'Creative Commons BY-SA license',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
		};
	},

	formatLastFMExtendedInfo(url: string, description: string): ExtendedInfo {
		return {
			url,
			description: MetaDataFormat.stripInlineLastFM(description),
			source: 'LastFM',
			license: 'Creative Commons BY-SA license',
			licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
		};
	}
};
