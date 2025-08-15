// eslint-disable-next-line unicorn/prevent-abbreviations
import { spawnTool } from '../../../utils/tool.js';

export interface MP3ValueWarning {
	offset?: string;
	msg: string;
}

export interface MP3ValueResult {
	fixed: boolean;
	warnings: Array<MP3ValueWarning>;
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

function parseMP3ValueWarning(data: string): MP3ValueWarning {
	let value = data;
	let index = value.indexOf('"');
	value = value.slice(index);
	index = value.indexOf('"');
	value = value.slice(index).trim();
	let offset: string | undefined;
	if (value.startsWith('(')) {
		index = value.indexOf(')');
		offset = value.slice(1, index - 1);
	}
	index = value.indexOf(':');
	value = value.slice(index).trim();
	return { offset, msg: value };
}

function parseMP3ValueResult(data: string): MP3ValueResult {
	const lines = data.split('\n');
	const result: MP3ValueResult = { fixed: false, warnings: [] };
	for (const line of lines) {
		if (line.startsWith('WARNING:')) {
			result.warnings.push(parseMP3ValueWarning(line));
		} else if (line.startsWith('FIXED')) {
			result.fixed = true;
		}
	}
	return result;
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export async function mp3val(filename: string, fix: boolean): Promise<MP3ValueResult> {
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
