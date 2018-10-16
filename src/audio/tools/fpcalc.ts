import {spawnToolJson} from '../../utils/tool';

export interface FPCalcOptions {
	length?: number;
	raw?: boolean;
}

export interface FPCalcResult {
	duration: number;
	fingerprint: string;
	fingerprintRaw?: Buffer;
}

export async function fpcalc(filename: string, options: FPCalcOptions): Promise<FPCalcResult> {
	const cmds: Array<string> = ['-json'];
	if (options.length) {
		cmds.push('-length', options.length.toFixed(0));
	}
	if (options.raw) {
		cmds.push('-raw');
	}
	return await spawnToolJson<FPCalcResult>('fpcalc', 'FPCALC_PATH', [...cmds, filename]);
}
