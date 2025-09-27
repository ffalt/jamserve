import { spawnTool } from '../../../utils/tool.js';
function parseMP3ValueWarning(data) {
    let value = data;
    let index = value.indexOf('"');
    value = value.slice(index);
    index = value.indexOf('"');
    value = value.slice(index).trim();
    let offset;
    if (value.startsWith('(')) {
        index = value.indexOf(')');
        offset = value.slice(1, index - 1);
    }
    index = value.indexOf(':');
    value = value.slice(index).trim();
    return { offset, msg: value };
}
function parseMP3ValueResult(data) {
    const lines = data.split('\n');
    const result = { fixed: false, warnings: [] };
    for (const line of lines) {
        if (line.startsWith('WARNING:')) {
            result.warnings.push(parseMP3ValueWarning(line));
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
        return Promise.reject(new Error(result.errMsg));
    }
    return parseMP3ValueResult(result.result);
}
//# sourceMappingURL=mp3val.js.map