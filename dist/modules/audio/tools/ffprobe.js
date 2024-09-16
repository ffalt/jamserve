import { spawnToolJson } from '../../../utils/tool.js';
export async function probe(filename, cmds) {
    return spawnToolJson('ffprobe', 'FFPROBE_PATH', ['-print_format', 'json', '-show_error', '-show_streams', '-show_format', ...cmds, filename]);
}
//# sourceMappingURL=ffprobe.js.map