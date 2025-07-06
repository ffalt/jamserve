import { describe, expect, test } from '@jest/globals';
import { generateJWT, jwtHash, JWTPayload } from '../../utils/jwt.js';
import jwt from 'jsonwebtoken';

describe('JWT functions', () => {
	test('should generate a valid JWT token that can be verified', () => {
		const userId = 'user123';
		const client = 'web';
		const secret = 'test_secret';
		const maxAge = 3600000; // 1 hour

		const token = generateJWT(userId, client, secret, maxAge);

		// Verify the token
		const decoded = jwt.verify(token, secret) as JWTPayload;

		expect(decoded.id).toBe(userId);
		expect(decoded.client).toBe(client);
		expect(decoded.exp).toBeDefined();

		// Hash the token
		const hash = jwtHash(token);
		expect(hash).toBeDefined();
		expect(typeof hash).toBe('string');
		expect(hash.length).toBe(64); // sha256 hash is 32 characters
	});
});
