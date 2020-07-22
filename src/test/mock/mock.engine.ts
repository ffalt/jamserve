import {EngineService} from '../../modules/engine/services/engine.service';

export async function waitEngineStart(engine: EngineService): Promise<void> {
	function wait(cb: () => void): void {
		if (engine.ioService.scanning) {
			setTimeout(() => {
				wait(cb);
			}, 100);
		} else {
			cb();
		}
	}

	return new Promise((resolve, reject) => {
		wait(resolve);
	});
}
