import {saveTS2JSONScheme} from './utils';
import path from 'path';

const basePath = path.resolve('../../src/model/');

async function run() {
	await saveTS2JSONScheme(basePath, 'subsonic-rest-api-1.16.0', 'SubsonicApi');
	await saveTS2JSONScheme(basePath, 'subsonic-rest-data-1.16.0', 'Subsonic.Response');
}

run()
	.catch(e => {
		console.error(e);
	});
