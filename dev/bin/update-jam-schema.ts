import {saveTS2JSONScheme, saveTS2NamespaceJSONScheme} from './utils';
import path from 'path';

const basePath = path.resolve('../../src/model/');

async function run() {
	await saveTS2NamespaceJSONScheme(basePath, 'jam-rest-data');
	await saveTS2JSONScheme(basePath, 'jam-rest-api', 'JamApi');
}

run()
	.catch(e => {
		console.error(e);
	});
