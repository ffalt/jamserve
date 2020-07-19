"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = exports.jwtHash = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash_1 = require("./hash");
function jwtHash(token) {
    return hash_1.hashMD5(token);
}
exports.jwtHash = jwtHash;
function generateJWT(userID, client, secret, maxAge) {
    const tokenData = { id: userID, client };
    if (maxAge > 0) {
        tokenData.exp = Math.floor((Date.now() + maxAge) / 1000);
    }
    return jsonwebtoken_1.default.sign(tokenData, secret);
}
exports.generateJWT = generateJWT;
//# sourceMappingURL=jwt.js.map