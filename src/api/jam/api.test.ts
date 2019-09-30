import {testEngines} from '../../engine/engine.spec';
import {JamApi} from './api';

describe('JamApi', () => {
	let jam: JamApi;
	testEngines({}, async testEngine => {
		jam = new JamApi(testEngine.engine);
	}, () => {
		it('should exist', async () => {
			expect(jam).toBeTruthy();
		});
	}, async () => {
		// nope
	});
});
