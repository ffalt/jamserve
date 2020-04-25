import crypto from 'crypto';
import {randomString} from './random';

function generateSalt16(): string {
	return randomString(16);
}

export function hashSaltSHA512(s: string, salt: string): string {
	/** Hashing algorithm sha512 */
	const hash = crypto.createHmac('sha512', salt);
	hash.update(s);
	return hash.digest('hex');
}

export function hashAndSaltSHA512(s: string): { salt: string; hash: string } {
	const salt = generateSalt16();
	return {salt, hash: hashSaltSHA512(s, salt)};
}

export function hashMD5(s: string): string {
	return crypto.createHash('md5').update(s).digest('hex');
}
