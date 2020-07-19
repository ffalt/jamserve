"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = exports.randomItems = exports.randomItem = exports.randomInt = exports.shuffle = void 0;
const crypto_1 = __importDefault(require("crypto"));
function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}
exports.shuffle = shuffle;
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randomInt = randomInt;
function randomItem(list) {
    const i = randomInt(0, list.length - 1);
    return list[i];
}
exports.randomItem = randomItem;
function randomItems(list, amount) {
    if (amount === undefined || amount < 0 || list.length <= amount) {
        return shuffle(list);
    }
    const result = [];
    const done = [];
    while ((result.length < amount)) {
        const i = randomInt(0, list.length - 1);
        if (!done.includes(i)) {
            result.push(list[i]);
            done.push(i);
        }
    }
    return result;
}
exports.randomItems = randomItems;
function randomString(length) {
    return crypto_1.default.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}
exports.randomString = randomString;
//# sourceMappingURL=random.js.map