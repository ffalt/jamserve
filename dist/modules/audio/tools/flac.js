import { spawnTool } from '../../../utils/tool.js';
export async function flac_test(filename) {
    const cmds = ['-wst'];
    const result = await spawnTool('flac', 'FLAC_PATH', [...cmds, filename]);
    if (result.errMsg && result.errMsg.length > 0) {
        return result.errMsg;
    }
    return;
}
//# sourceMappingURL=flac.js.map