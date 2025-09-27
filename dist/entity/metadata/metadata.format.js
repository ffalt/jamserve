export const MetaDataFormat = {
    stripInlineLastFM(content) {
        return (content || '')
            .replaceAll(/<a href=".*">Read more on Last\.fm<\/a>\.?/g, '')
            .replaceAll(/<a .* href=".*">Read more on Last\.fm<\/a>\.?/g, '')
            .replaceAll('User-contributed text is available under the Creative Commons By-SA License; additional terms may apply.', '');
    },
    stripInlineWikipediaHTML(content) {
        return (content || '')
            .replaceAll(/<p class="mw-empty-elt">\s*<\/p>/g, '')
            .replaceAll('<p>', '')
            .replaceAll('</p>', '\n');
    },
    formatWikipediaExtendedInfo(url, description) {
        return {
            url,
            description: MetaDataFormat.stripInlineWikipediaHTML(description),
            source: 'Wikipedia',
            license: 'Creative Commons BY-SA license',
            licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
        };
    },
    formatLastFMExtendedInfo(url, description) {
        return {
            url,
            description: MetaDataFormat.stripInlineLastFM(description),
            source: 'LastFM',
            license: 'Creative Commons BY-SA license',
            licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/'
        };
    }
};
//# sourceMappingURL=metadata.format.js.map