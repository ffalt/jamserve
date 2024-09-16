import jwt from 'jsonwebtoken';
import { hashMD5 } from './md5.js';
export function jwtHash(token) {
    return hashMD5(token);
}
export function generateJWT(userID, client, secret, maxAge) {
    const tokenData = { id: userID, client };
    if (maxAge > 0) {
        tokenData.exp = Math.floor((Date.now() + maxAge) / 1000);
    }
    return jwt.sign(tokenData, secret);
}
//# sourceMappingURL=jwt.js.map