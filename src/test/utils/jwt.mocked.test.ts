import { describe, expect, test, jest } from '@jest/globals';
import { generateJWT, jwtHash, JWTPayload } from '../../utils/jwt.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn()
}));

describe('JWT functions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('generateJWT', () => {
		beforeEach(() => {
			jest.spyOn(jwt, 'sign').mockImplementation(() => 'generated_token');
			// Mock Date.now() to return a fixed timestamp
			jest.spyOn(Date, 'now').mockReturnValue(1600000000000); // 2020-09-13T12:26:40.000Z
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		test('should generate a JWT token with user ID and client', () => {
			const result = generateJWT('user123', 'web', 'secret', 0);

			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: 'user123', client: 'web' },
				'secret'
			);
			expect(result).toBe('generated_token');
		});

		test('should include expiration time if maxAge is greater than 0', () => {
			const maxAge = 3600000; // 1 hour in milliseconds
			const result = generateJWT('user123', 'web', 'secret', maxAge);

			expect(jwt.sign).toHaveBeenCalledWith(
				{
					id: 'user123',
					client: 'web',
					exp: Math.floor((1600000000000 + maxAge) / 1000) // Expected expiration timestamp
				},
				'secret'
			);
			expect(result).toBe('generated_token');
		});

		test('should not include expiration time if maxAge is 0', () => {
			const result = generateJWT('user123', 'web', 'secret', 0);

			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: 'user123', client: 'web' },
				'secret'
			);
			expect(result).toBe('generated_token');
		});

		test('should not include expiration time if maxAge is negative', () => {
			const result = generateJWT('user123', 'web', 'secret', -1);

			expect(jwt.sign).toHaveBeenCalledWith(
				{ id: 'user123', client: 'web' },
				'secret'
			);
			expect(result).toBe('generated_token');
		});
	});

	describe('Integration tests', () => {
		beforeAll(() => {
			// Use the real implementations for this test
			jest.unmock('jsonwebtoken');
			jest.unmock('../../utils/md5.js');
			jest.restoreAllMocks();
		});

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
});
