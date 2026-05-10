import { EngineService } from '../../src/modules/engine/services/engine.service.js';

export async function waitEngineStart(engine: EngineService): Promise<void> {
	function wait(callback: () => void): void {
		if (engine.io.scanning) {
			setTimeout(() => {
				wait(callback);
			}, 100);
		} else {
			callback();
		}
	}

	return new Promise(resolve => {
		wait(resolve);
	});
}
