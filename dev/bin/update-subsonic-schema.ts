import path from 'path';
import {saveTS2JSONScheme} from './utils';

const basePath = path.resolve('../../src/model/');

async function run(): Promise<void> {
	await saveTS2JSONScheme(basePath, 'subsonic-rest-api', 'SubsonicApi');
	await saveTS2JSONScheme(basePath, 'subsonic-rest-data', 'Subsonic.Response');
}

run()
	.catch(e => {
		console.error(e);
	});
