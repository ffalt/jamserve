"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashMD5 = void 0;
const crypto_1 = __importDefault(require("crypto"));
function hashMD5(s) {
    return crypto_1.default.createHash('md5').update(s).digest('hex');
}
exports.hashMD5 = hashMD5;
//# sourceMappingURL=md5.js.map