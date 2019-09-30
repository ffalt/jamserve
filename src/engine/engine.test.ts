import {testEngines} from './engine.spec';

describe('Engine', () => {
	testEngines({}, async () => {
		// nope
	}, testEngine => {
		it('should refresh', async () => {
			await testEngine.engine.refresh();
		});
	});
});
