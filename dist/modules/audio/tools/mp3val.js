import { spawnTool } from '../../../utils/tool.js';
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
export async function mp3val(filename, fix) {
    const cmds = ['-si'];
    if (fix) {
        cmds.push('-f');
    }
    const result = await spawnTool('mp3val', 'MP3VAL_PATH', [...cmds, filename]);
    if (result.errMsg) {
        return Promise.reject(Error(result.errMsg));
    }
    return parseMP3ValResult(result.result);
}
//# sourceMappingURL=mp3val.js.map