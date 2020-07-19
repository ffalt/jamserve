"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAMSERVE_VERSION = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const pack = fs_extra_1.default.readJSONSync(path_1.default.join(__dirname, '../package.json'));
exports.JAMSERVE_VERSION = pack.version;
//# sourceMappingURL=version.js.map