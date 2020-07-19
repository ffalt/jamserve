"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMaxAge = void 0;
const moment_1 = __importDefault(require("moment"));
function getMaxAge(maxAgeSpec) {
    if (!maxAgeSpec) {
        return 0;
    }
    const split = maxAgeSpec.split(' ');
    const value = Number(split[0]);
    const unit = split[1];
    let maxAge = 0;
    if (value > 0) {
        maxAge = moment_1.default.duration(value, unit).asMilliseconds();
    }
    return maxAge;
}
exports.getMaxAge = getMaxAge;
//# sourceMappingURL=max-age.js.map