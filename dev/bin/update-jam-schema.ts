import {saveTS2JSONScheme} from './utils';
import path from 'path';

const basePath = path.resolve('../../src/model/');

async function run() {
	await saveTS2JSONScheme(basePath, 'jam-rest-data-0.1.0', 'Jam.Data');
	await saveTS2JSONScheme(basePath, 'jam-rest-api-0.1.0', 'JamApi');
}

run()
	.catch(e => {
		console.error(e);
	});
