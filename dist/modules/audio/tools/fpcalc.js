import { spawnToolJson } from '../../../utils/tool.js';
export async function fpcalc(filename, options) {
    const cmds = ['-json'];
    if (options.length) {
        cmds.push('-length', options.length.toFixed(0));
    }
    if (options.raw) {
        cmds.push('-raw');
    }
    return spawnToolJson('fpcalc', 'FPCALC_PATH', [...cmds, filename]);
}
//# sourceMappingURL=fpcalc.js.map