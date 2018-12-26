import {saveTS2JSONScheme} from './utils';
import path from 'path';

const basePath = path.resolve('../../src/model/');

async function run() {
	await saveTS2JSONScheme(basePath, 'subsonic-rest-api', 'SubsonicApi');
	await saveTS2JSONScheme(basePath, 'subsonic-rest-data', 'Subsonic.Response');
}

run()
	.catch(e => {
		console.error(e);
	});
