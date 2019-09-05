import {testEngines} from './engine.spec';

describe('Engine', () => {
	testEngines({}, async () => {
	}, (testEngine) => {
		it('should refresh', async () => {
			await testEngine.engine.refresh();
		});
	});
});
