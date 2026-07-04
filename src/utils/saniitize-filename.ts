/**
 * Sanitize a filename for safe use in file systems and Content-Disposition headers.
 */
export function sanitizeFilename(s: string): string {
	return s.replaceAll(/["\\]/g, '_')
		// eslint-disable-next-line no-control-regex
		.replaceAll(/[\u{0}-\u{1F}\u{7F}]/gu, '');
}
