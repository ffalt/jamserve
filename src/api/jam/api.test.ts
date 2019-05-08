import {should} from 'chai';
import {describe, it} from 'mocha';
import {testEngines} from '../../engine/engine.spec';
import {JamApi} from './api';

describe('JamApi', () => {
	let jam: JamApi;
	testEngines({}, async (testEngine) => {
		jam = new JamApi(testEngine.engine);
	}, () => {
		it('should exist', async () => {
			should().exist(jam);
		});
	}, async () => {

	});
});
