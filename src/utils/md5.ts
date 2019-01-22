import crypto from 'crypto';

export function md5string(s: string): string {
	return crypto.createHash('md5').update(s).digest('hex');
}
