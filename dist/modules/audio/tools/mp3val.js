"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mp3val = void 0;
const tool_1 = require("../../../utils/tool");
function parseMP3ValWarning(data) {
    let s = data;
    let i = s.indexOf('"');
    s = s.slice(i);
    i = s.indexOf('"');
    s = s.slice(i).trim();
    let offset;
    if (s[0] === '(') {
        i = s.indexOf(')');
        offset = s.slice(1, i - 1);
    }
    i = s.indexOf(':');
    s = s.slice(i).trim();
    return { offset, msg: s };
}
function parseMP3ValResult(data) {
    const lines = data.split('\n');
    const result = { fixed: false, warnings: [] };
    for (const line of lines) {
        if (line.startsWith('WARNING:')) {
            result.warnings.push(parseMP3ValWarning(line));
        }
        else if (line.startsWith('FIXED')) {
            result.fixed = true;
        }
    }
    return result;
}
async function mp3val(filename, fix) {
    const cmds = ['-si'];
    if (fix) {
        cmds.push('-f');
    }
    const result = await tool_1.spawnTool('mp3val', 'MP3VAL_PATH', [...cmds, filename]);
    if (result.errMsg) {
        return Promise.reject(Error(result.errMsg));
    }
    return parseMP3ValResult(result.result);
}
exports.mp3val = mp3val;
//# sourceMappingURL=mp3val.js.map