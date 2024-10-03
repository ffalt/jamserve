import jwt from 'jsonwebtoken';
import { hashMD5 } from './md5.js';

export interface JWTPayload {
	id: string;
	exp?: number;
	client: string;
}

export function jwtHash(token: string): string {
	return hashMD5(token);
}

export function generateJWT(userID: string, client: string, secret: string, maxAge: number): string {
	const tokenData: JWTPayload = { id: userID, client };
	if (maxAge > 0) {
		tokenData.exp = Math.floor((Date.now() + maxAge) / 1000);
	}
	return jwt.sign(tokenData, secret);
}
