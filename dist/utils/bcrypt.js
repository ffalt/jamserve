"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptComparePassword = exports.bcryptPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function bcryptPassword(password) {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt_1.default.hash(password, saltRounds, (err, hashAndSalt) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(hashAndSalt);
            }
        });
    });
}
exports.bcryptPassword = bcryptPassword;
async function bcryptComparePassword(password, hashAndSalt) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(password, hashAndSalt, function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.bcryptComparePassword = bcryptComparePassword;
//# sourceMappingURL=bcrypt.js.map