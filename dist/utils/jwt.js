import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
export function jwtHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
export function generateJWT(userID, client, secret, maxAge) {
    const tokenData = { id: userID, client };
    if (maxAge > 0) {
        tokenData.exp = Math.floor((Date.now() + maxAge) / 1000);
    }
    return jwt.sign(tokenData, secret);
}
//# sourceMappingURL=jwt.js.map