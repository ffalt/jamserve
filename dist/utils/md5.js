import crypto from 'crypto';
export function hashMD5(s) {
    return crypto.createHash('md5').update(s).digest('hex');
}
//# sourceMappingURL=md5.js.map