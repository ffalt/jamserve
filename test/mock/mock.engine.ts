import { EngineService } from '../../src/modules/engine/services/engine.service.js';

export async function waitEngineStart(engine: EngineService): Promise<void> {
	function wait(cb: () => void): void {
		if (engine.io.scanning) {
			setTimeout(() => {
				wait(cb);
			}, 100);
		} else {
			cb();
		}
	}

	return new Promise(resolve => wait(resolve));
}
