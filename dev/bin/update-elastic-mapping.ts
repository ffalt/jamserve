import fse from 'fs-extra';
import path from 'path';
import {run, transformTS2JSONScheme} from './utils';

function transformProperty(name: string, parent: string, prop: any, definitions: any, paths: Array<string>, done: Array<string>, result: Array<string>): string {
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
		return transformProperty(name, parent, prop.items, definitions, paths, done, result);
	}
	if (prop.type === 'object') {
		return transformProperties(key, prop.properties, definitions, paths, done, result);
	}
	if (Object.keys(prop).length > 0) {
		console.log('TODO', prop);
	}
	return '';
}

function transformProperties(symbol: string, props: any, definitions: any, paths: Array<string>, done: Array<string>, result: Array<string>): any {
	if (symbol.length > 0 && done.includes(symbol)) {
		const name = `type${symbol.replace(/\./g, '_')}`;
		return name;
	}
	const properties: any = {};
	Object.keys(props).forEach(key => {
		const prop = props[key];
		const val = transformProperty(key, symbol, prop, definitions, paths.concat([key]), done, result);
		if (val && val.length > 0) {
			properties[key] = val;
		}
	});
	if (symbol.length > 0 && !done.includes(symbol)) {
		done.push(symbol);
		const name = `type${symbol.replace(/\./g, '_')}`;
		result.push(`const ${name} = ${JSON.stringify({properties}, null, '\t').replace(/"/g, '')};
`);
		return name;
	}
	return {properties};
}

async function build(): Promise<string> {
	const basePath = '../../src/';
	const destfile = path.resolve(basePath, 'db', 'elasticsearch', 'db-elastic.mapping.ts');
	const result: Array<string> = [
		`// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

const typeBool = {type: 'boolean'};

const typeInt = {type: 'long'};

const typeString = {type: 'text', fields: {keyword: {type: 'keyword'}}};

const typeKey = {type: 'keyword'};
`];
	const done: Array<string> = [];
	const symbols = ['Root', 'User', 'Folder', 'PlayQueue', 'Track', 'Album', 'Artist', 'Radio', 'State', 'Playlist', 'Podcast', 'Episode', 'Bookmark', 'MetaData', 'Settings', 'Session'];
	const object: any = {};
	for (const symbol of symbols) {
		const baseP = path.resolve(basePath, `engine/${symbol.toLowerCase()}`);
		const scheme = await transformTS2JSONScheme(baseP, `${symbol.toLowerCase()}.model`, symbol);
		transformProperties(symbol, scheme.properties || {}, scheme.definitions || {}, [], done, result);
		object[symbol.toLowerCase()] = `type${symbol.replace(/\./g, '_')}`;
	}
	result.push(`export const mapping: any = ${JSON.stringify(object, null, '\t').replace(/"/g, '')};
`);
	await fse.writeFile(destfile, result.join('\n'));
	return destfile;
}

run(build);
