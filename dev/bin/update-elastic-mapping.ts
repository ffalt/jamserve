import path from 'path';
import {transformTS2JSONScheme} from './utils';
import {fileWrite} from '../../src/utils/fs-utils';

const basePath = '../../src/';
const destfile = path.resolve(basePath, 'store', 'elasticsearch', 'mapping.ts');

async function run(): Promise<void> {
	const strings: Array<string> = [];
	const done: Array<string> = [];

	/*
	const stringDefs: { [name: string]: { texts: Array<string> } } = {
		// 'Root': {texts: []},
		// 'Bookmark': {texts: ['comment']},
		// 'Episode': {texts: ['title', 'summary']},
		// 'User': {texts: []},
		// 'Folder': {texts: []},
		// 'Artist': {texts: ['name', 'nameSort']},
		// 'Podcast': {texts: []},
		// 'Radio': {texts: ['name']},
		// 'Playlist': {texts: ['name', 'comment']},
		// 'PodcastTag': {texts: ['description', 'author', 'title']},
		// 'PodcastEpisodeChapter': {texts: ['title']},
		// 'MetaInfoAlbum': {texts: ['name', 'artist']},
		// 'FolderTag': {texts: ['genre', 'album', 'artist', 'artistSort', 'title']}
	};
	*/

	function transformProperty(name: string, parent: string, prop: any, definitions: any, paths: Array<string>): string {
		// console.log(paths, prop);
		let key = '';
		if (prop.$ref) {
			key = prop.$ref.split('/')[2];
			prop = definitions[key];
		}
		if (prop.type === 'string') {
			// if (['id', 'mbid', 'url', 'type', 'link', 'mode', 'format', 'status'].indexOf(name) >= 0) {
			// 	return 'type_key';
			// }
			// if (name.indexOf('Id') === name.length - 2) {
			// 	return 'type_key';
			// }
			// if (name.indexOf('ID') === name.length - 2) {
			// 	return 'type_key';
			// }
			// if (name.indexOf('IDs') === name.length - 3) {
			// 	return 'type_key';
			// }
			// const def = stringDefs[parent];
			// if (def) {
			// 	if (def.texts.indexOf(name) >= 0) {
			// 		return 'type_text';
			// 	}
			// 	return 'type_key';
			// }
			// console.log(name + ': string in ' + parent);
			return 'type_key';
		} else if (prop.type === 'number') {
			return 'type_int';
		} else if (prop.type === 'boolean') {
			return 'type_bool';
		} else if (prop.type === 'array') {
			return transformProperty(name, parent, prop.items, definitions, paths);
		} else if (prop.type === 'object') {
			return transformProperties(key, prop.properties, definitions, paths);
		} else {
			console.log('TODO', prop);
			return '';
		}
	}

	function transformProperties(symbol: string, props: any, definitions: any, paths: Array<string>): any {
		if (symbol.length > 0 && done.indexOf(symbol) >= 0) {
			const name = 'type_' + symbol.replace(/\./g, '_');
			return name;
		}
		const properties: any = {};
		Object.keys(props).forEach(key => {
			const prop = props[key];
			properties[key] = transformProperty(key, symbol, prop, definitions, paths.concat([key]));
		});
		if (symbol.length > 0 && done.indexOf(symbol) < 0) {
			done.push(symbol);
			const name = 'type_' + symbol.replace(/\./g, '_');
			strings.push('const ' + name + ' = ' + JSON.stringify({properties: properties}, null, '\t').replace(/"/g, '') + ';\n');
			return name;
		} else {
			return {properties: properties};
		}
	}

	const symbols = ['Root', 'User', 'Folder', 'PlayQueue', 'Track', 'Album', 'Artist', 'Radio', 'State', 'Playlist', 'Podcast', 'Episode', 'Bookmark'];
	const result: any = {};
	strings.push('const type_bool = {type: \'boolean\'};\n');
	strings.push('const type_int = {type: \'long\'};\n');
	strings.push('const type_string = {type: \'text\'};\n');
	strings.push('const type_key = {type: \'keyword\'};\n');
	for (const symbol of symbols) {
		const name = '' + symbol;
		const scheme = await transformTS2JSONScheme('jamserve', name);
		transformProperties(name, scheme.properties || {}, scheme.definitions || {}, []);
		result[symbol.toLowerCase()] = 'type_' + name.replace(/\./g, '_');
	}
	strings.push('export const mapping: any = ' + JSON.stringify(result, null, '\t').replace(/"/g, '') + ';\n');
	await fileWrite(destfile, strings.join('\n'));
}

run()
	.then(() => {
		console.log(destfile, 'written');
	})
	.catch(e => {
		console.error(e);
	});
