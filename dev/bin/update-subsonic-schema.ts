import {saveTS2JSONScheme} from './utils';

async function run() {
	await saveTS2JSONScheme('subsonic-rest-api-1.16.0', 'SubsonicApi');
	await saveTS2JSONScheme('subsonic-rest-data-1.16.0', 'Subsonic.Response');
}

run()
	.catch(e => {
		console.error(e);
	});
