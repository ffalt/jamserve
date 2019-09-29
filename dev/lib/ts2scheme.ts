import fse from 'fs-extra';
import path from 'path';
import * as TJS from 'typescript-json-schema';
import {Definition} from './json-schema';

export async function transformTS2JSONScheme(basePath: string, filename: string, symbol: string): Promise<Definition> {
	const compilerOptions: TJS.CompilerOptions = {
		strictNullChecks: true,
		resolveJsonModule: true,
		rootDir: basePath,
		typeRoots: [basePath]
	};
	const file = path.resolve(basePath, `${filename}.d.ts`);
	const program = TJS.getProgramFromFiles([file], compilerOptions, basePath);
	const generator = TJS.buildGenerator(program, {required: true});
	if (!generator) {
		console.log(program);
		return Promise.reject('Typescript generation failed');
	}
	const scheme = generator.getSchemaForSymbol(symbol, true);
	if (scheme) {
		return scheme as Definition;
	}
	return Promise.reject(`Typescript symbol not found: ${symbol}`);
}

export async function saveTS2JSONScheme(basePath: string, filename: string, symbol: string): Promise<void> {
	const scheme = await transformTS2JSONScheme(basePath, filename, symbol);
	const destfile = path.resolve(basePath, `${filename}.schema.json`);
	await fse.writeFile(destfile, JSON.stringify(scheme, null, '\t'));
	console.log('👍', destfile, 'written');
}
