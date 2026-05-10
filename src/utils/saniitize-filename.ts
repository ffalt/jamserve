/**
 * Sanitize a filename for safe use in file systems and Content-Disposition headers.
 */
export function sanitizeFilename(s: string): string {
	return s.replaceAll(/["\\]/g, '_')
		// eslint-disable-next-line no-control-regex
		.replaceAll(/[\u0000-\u001F\u007F]/g, '');
}
