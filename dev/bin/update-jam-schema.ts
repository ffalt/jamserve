import path from 'path';
import {saveTS2JSONScheme, saveTS2NamespaceJSONScheme} from './utils';

const basePath = path.resolve('../../src/model/');

async function run(): Promise<void> {
	await saveTS2NamespaceJSONScheme(basePath, 'jam-rest-data');
	await saveTS2JSONScheme(basePath, 'jam-rest-api', 'JamApi');
}

run()
	.catch(e => {
		console.error(e);
	});
