import {testService} from '../base/base.service.spec';
import {RadioService} from './radio.service';

describe('RadioService', () => {
	let radioService: RadioService;
	testService({mockData: false},
		async store => {
			radioService = new RadioService(store.radioStore);
		},
		() => {
			it('should create a radio', async () => {
				const radio = await radioService.create('test radio', 'a stream url', 'a homepage url');
				expect(radio).toBeTruthy();
			});
			it('should update a radio', async () => {
				const radio = await radioService.radioStore.random();
				expect(radio).toBeTruthy(); // 'Invalid Test Setup');
				if (!radio) {
					return;
				}
				await radioService.update(radio, 'a new name');
				const r = await radioService.radioStore.byId(radio.id);
				expect(r).toBeTruthy();
				if (r) {
					expect(r.name).toBe('a new name');
				}
				await radioService.update(radio, undefined, 'another url');
				await radioService.update(radio, undefined, undefined, 'another url');
				await radioService.update(radio, undefined, undefined, undefined);
			});
			it('should remove a radio', async () => {
				const radio = await radioService.radioStore.random();
				expect(radio).toBeTruthy(); // 'Invalid Test Setup');
				if (!radio) {
					return;
				}
				await radioService.remove(radio);
				const r = await radioService.radioStore.byId(radio.id);
				expect(r).toBeUndefined();
			});
		},
		async () => {
			// nope
		}
	);
});
