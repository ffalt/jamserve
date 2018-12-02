import {saveTS2JSONScheme, saveTS2NamespaceJSONScheme} from './utils';
import path from 'path';

const basePath = path.resolve('../../src/model/');

async function run() {
	await saveTS2NamespaceJSONScheme(basePath, 'jam-rest-data-0.1.0');
	await saveTS2JSONScheme(basePath, 'jam-rest-api-0.1.0', 'JamApi');
}

run()
	.catch(e => {
		console.error(e);
	});
