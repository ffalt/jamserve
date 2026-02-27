import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

export interface JWTPayload {
	id: string;
	exp?: number;
	client: string;
}

export function jwtHash(token: string): string {
	return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateJWT(userID: string, client: string, secret: string, maxAge: number): string {
	const tokenData: JWTPayload = { id: userID, client };
	if (maxAge > 0) {
		tokenData.exp = Math.floor((Date.now() + maxAge) / 1000);
	}
	return jwt.sign(tokenData, secret, { algorithm: 'HS256' });
}
