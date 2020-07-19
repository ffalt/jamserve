"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.probe = void 0;
const tool_1 = require("../../../utils/tool");
async function probe(filename, cmds) {
    return tool_1.spawnToolJson('ffprobe', 'FFPROBE_PATH', ['-print_format', 'json', '-show_error', '-show_streams', '-show_format', ...cmds, filename]);
}
exports.probe = probe;
//# sourceMappingURL=ffprobe.js.map