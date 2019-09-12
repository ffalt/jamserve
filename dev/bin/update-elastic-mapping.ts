import fse from 'fs-extra';
import path from 'path';
import {transformTS2JSONScheme} from './utils';

const basePath = '../../src/';
const destfile = path.resolve(basePath, 'db', 'elasticsearch', 'db-elastic.mapping.ts');

async function run(): Promise<void> {
	const strings: Array<string> = [
		'// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY'
	];
	const done: Array<string> = [];

	function transformProperty(name: string, parent: string, prop: any, definitions: any, paths: Array<string>): string {
		let key = '';
		if (prop.$ref) {
			key = prop.$ref.split('/')[2];
			prop = definitions[key];
		}
		if (prop.type === 'string') {
			if (['name', 'title'].includes(name)) {
				return 'typeString';
			}
			return 'typeKey';
		}
		if (prop.type === 'number') {
			return 'typeInt';
		}
		if (prop.type === 'boolean') {
			return 'typeBool';
		}
		if (prop.type === 'array') {
			return transformProperty(name, parent, prop.items, definitions, paths);
		}
		if (prop.type === 'object') {
			return transformProperties(key, prop.properties, definitions, paths);
		}
		if (Object.keys(prop).length > 0) {
			console.log('TODO', prop);
		}
		return '';
	}

	function transformProperties(symbol: string, props: any, definitions: any, paths: Array<string>): any {
		if (symbol.length > 0 && done.includes(symbol)) {
			const name = `type${symbol.replace(/\./g, '_')}`;
			return name;
		}
		const properties: any = {};
		Object.keys(props).forEach(key => {
			const prop = props[key];
			const val = transformProperty(key, symbol, prop, definitions, paths.concat([key]));
			if (val && val.length > 0) {
				properties[key] = val;
			}
		});
		if (symbol.length > 0 && !done.includes(symbol)) {
			done.push(symbol);
			const name = `type${symbol.replace(/\./g, '_')}`;
			strings.push(`const ${name} = ${JSON.stringify({properties}, null, '\t').replace(/"/g, '')};
`);
			return name;
		}
		return {properties};
	}

	const symbols = ['Root', 'User', 'Folder', 'PlayQueue', 'Track', 'Album', 'Artist', 'Radio', 'State', 'Playlist', 'Podcast', 'Episode', 'Bookmark', 'MetaData', 'Settings'];
	const result: any = {};
	strings.push('const typeBool = {type: \'boolean\'};\n');
	strings.push('const typeInt = {type: \'long\'};\n');
	strings.push('const typeString = {type: \'text\', fields: {keyword: {type: \'keyword\'}}};\n');
	strings.push('const typeKey = {type: \'keyword\'};\n');
	for (const symbol of symbols) {
		const baseP = path.resolve(basePath, `engine/${symbol.toLowerCase()}`);
		const scheme = await transformTS2JSONScheme(baseP, `${symbol.toLowerCase()}.model`, symbol);
		transformProperties(symbol, scheme.properties || {}, scheme.definitions || {}, []);
		result[symbol.toLowerCase()] = `type${symbol.replace(/\./g, '_')}`;
	}
	strings.push(`export const mapping: any = ${JSON.stringify(result, null, '\t').replace(/"/g, '')};
`);
	await fse.writeFile(destfile, strings.join('\n'));
}

run()
	.then(() => {
		console.log('👍', destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
