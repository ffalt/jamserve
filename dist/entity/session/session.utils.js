"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAgent = void 0;
const express_useragent_1 = __importDefault(require("express-useragent"));
function parseAgent(session) {
    try {
        return express_useragent_1.default.parse(session.agent);
    }
    catch (e) {
    }
}
exports.parseAgent = parseAgent;
//# sourceMappingURL=session.utils.js.map