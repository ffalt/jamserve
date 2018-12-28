import crypto from 'crypto';
import {randomString} from './random';

function generateSalt(): string {
	return randomString(16);
}

export function hashSalt(password: string, salt: string): string {
	/** Hashing algorithm sha512 */
	const hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	return hash.digest('hex');
}

export function hashSaltPassword(password: string): { salt: string, hash: string } {
	const salt = generateSalt();
	return {salt, hash: hashSalt(password, salt)};
}
