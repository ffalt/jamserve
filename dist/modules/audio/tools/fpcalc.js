"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fpcalc = void 0;
const tool_1 = require("../../../utils/tool");
async function fpcalc(filename, options) {
    const cmds = ['-json'];
    if (options.length) {
        cmds.push('-length', options.length.toFixed(0));
    }
    if (options.raw) {
        cmds.push('-raw');
    }
    return tool_1.spawnToolJson('fpcalc', 'FPCALC_PATH', [...cmds, filename]);
}
exports.fpcalc = fpcalc;
//# sourceMappingURL=fpcalc.js.map