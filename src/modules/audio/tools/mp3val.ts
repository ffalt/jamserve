import { spawnTool } from '../../../utils/tool.js';

export interface MP3ValWarning {
	offset?: string;
	msg: string;
}

export interface MP3ValResult {
	fixed: boolean;
	warnings: Array<MP3ValWarning>;
}

/* example output
 Analyzing file "filename"...
 INFO: "filename": 12830 MPEG frames (MPEG 1 Layer III), +ID3v1+ID3v2, CBR
 WARNING: "filename" (offset 0x2b9411): MPEG stream error, resynchronized successfully
 WARNING: "filename": Wrong number of MPEG frames specified in Xing header (8265 instead of 8262)
 WARNING: "filename": Wrong number of MPEG data bytes specified in Xing header (4550632 instead of 4548544)
 FIXED: "filename": File was rebuilt
 Done!
 **/

function parseMP3ValWarning(data: string): MP3ValWarning {
	let s = data;
	let i = s.indexOf('"');
	s = s.slice(i);
	i = s.indexOf('"');
	s = s.slice(i).trim();
	let offset: string | undefined;
	if (s.startsWith('(')) {
		i = s.indexOf(')');
		offset = s.slice(1, i - 1);
	}
	i = s.indexOf(':');
	s = s.slice(i).trim();
	return { offset, msg: s };
}

function parseMP3ValResult(data: string): MP3ValResult {
	const lines = data.split('\n');
	const result: MP3ValResult = { fixed: false, warnings: [] };
	for (const line of lines) {
		if (line.startsWith('WARNING:')) {
			result.warnings.push(parseMP3ValWarning(line));
		} else if (line.startsWith('FIXED')) {
			result.fixed = true;
		}
	}
	return result;
}

export async function mp3val(filename: string, fix: boolean): Promise<MP3ValResult> {
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
