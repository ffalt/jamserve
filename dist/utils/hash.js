"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashMD5 = exports.hashAndSaltSHA512 = exports.hashSaltSHA512 = void 0;
const crypto_1 = __importDefault(require("crypto"));
const random_1 = require("./random");
function generateSalt16() {
    return random_1.randomString(16);
}
function hashSaltSHA512(s, salt) {
    const hash = crypto_1.default.createHmac('sha512', salt);
    hash.update(s);
    return hash.digest('hex');
}
exports.hashSaltSHA512 = hashSaltSHA512;
function hashAndSaltSHA512(s) {
    const salt = generateSalt16();
    return { salt, hash: hashSaltSHA512(s, salt) };
}
exports.hashAndSaltSHA512 = hashAndSaltSHA512;
function hashMD5(s) {
    return crypto_1.default.createHash('md5').update(s).digest('hex');
}
exports.hashMD5 = hashMD5;
//# sourceMappingURL=hash.js.map