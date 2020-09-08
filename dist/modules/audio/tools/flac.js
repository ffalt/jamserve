"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flac_test = void 0;
const tool_1 = require("../../../utils/tool");
async function flac_test(filename) {
    const cmds = ['-wst'];
    const result = await tool_1.spawnTool('flac', 'FLAC_PATH', [...cmds, filename]);
    if (result.errMsg && result.errMsg.length > 0) {
        return result.errMsg;
    }
    return;
}
exports.flac_test = flac_test;
//# sourceMappingURL=flac.js.map