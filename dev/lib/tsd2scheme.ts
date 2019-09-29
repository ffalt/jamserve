import fse from 'fs-extra';
import path from 'path';
import * as TJS from 'typescript-json-schema';
import {Definition} from './json-schema';

export async function transformTS2NamespaceJSONScheme(basePath: string, filename: string): Promise<Definition> {
	const compilerOptions: TJS.CompilerOptions = {
		strictNullChecks: true,
		rootDir: basePath,
		resolveJsonModule: true,
		typeRoots: [basePath]
	};
	const file = path.resolve(basePath, `${filename}.d.ts`);
	const program = TJS.getProgramFromFiles([file], compilerOptions, basePath);
	const generator = TJS.buildGenerator(program, {required: true});
	if (!generator) {
		console.log(program);
		return Promise.reject('Typescript generation failed');
	}
	const symbols = generator.getUserSymbols();
	const scheme = generator.getSchemaForSymbols(symbols, true);
	if (scheme) {
		return scheme as Definition;
	}
	return Promise.reject(`Typescript schema could not be created: ${filename}`);
}

export async function saveTS2NamespaceJSONScheme(basePath: string, filename: string): Promise<void> {
	const scheme = await transformTS2NamespaceJSONScheme(basePath, filename);
	const destfile = path.resolve(basePath, `${filename}.schema.json`);
	await fse.writeFile(destfile, JSON.stringify(scheme, null, '\t'));
	console.log('👍', destfile, 'written');
}
