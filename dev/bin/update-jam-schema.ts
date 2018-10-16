import {saveTS2JSONScheme} from './utils';

async function run() {
	await saveTS2JSONScheme('jam-rest-data-0.1.0', 'Jam.Data');
	await saveTS2JSONScheme('jam-rest-api-0.1.0', 'JamApi');
}

run()
	.catch(e => {
		console.error(e);
	});
