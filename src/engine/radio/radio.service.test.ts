import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {RadioService} from './radio.service';

describe('RadioService', () => {
	let radioService: RadioService;
	testService({mockData: false},
		async (store, imageModuleTest) => {
			radioService = new RadioService(store.radioStore);
		},
		() => {
			it('should create a radio', async () => {
				const radio = await radioService.create('test radio', 'a stream url', 'a homepage url');
				should().exist(radio);
			});
			it('should update a radio', async () => {
				const radio = await radioService.radioStore.random();
				should().exist(radio, 'Wrong Test Setup');
				if (!radio) {
					return;
				}
				await radioService.update(radio, 'a new name');
				const r = await radioService.radioStore.byId(radio.id);
				should().exist(r);
				if (r) {
					expect(r.name).to.be.equal('a new name');
				}
				await radioService.update(radio, undefined, 'another url');
				await radioService.update(radio, undefined, undefined, 'another url');
				await radioService.update(radio, undefined, undefined, undefined);
			});
			it('should remove a radio', async () => {
				const radio = await radioService.radioStore.random();
				should().exist(radio, 'Wrong Test Setup');
				if (!radio) {
					return;
				}
				await radioService.remove(radio);
				const r = await radioService.radioStore.byId(radio.id);
				should().not.exist(r);
			});
		},
		async () => {
		}
	);
});
