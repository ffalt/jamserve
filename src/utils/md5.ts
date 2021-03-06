import crypto from 'crypto';

export function hashMD5(s: string): string {
	return crypto.createHash('md5').update(s).digest('hex');
}
