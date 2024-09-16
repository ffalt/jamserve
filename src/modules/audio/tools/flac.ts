import {spawnTool} from '../../../utils/tool.js';

export async function flac_test(filename: string): Promise<string | undefined> {
	const cmds: Array<string> = ['-wst'];
	const result = await spawnTool('flac', 'FLAC_PATH', [...cmds, filename]);
	if (result.errMsg && result.errMsg.length > 0) {
		return result.errMsg;
	}
	return;
}
