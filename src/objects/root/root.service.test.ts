import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {RootService} from './root.service';
import {mockRoot} from './root.mock';

describe('RootService', () => {
	let rootService: RootService;
	testService({mockData: true},
		(store, imageModuleTest) => {
			rootService = new RootService(store.rootStore);
		},
		() => {
			it('should find roots', async () => {
				const roots = await rootService.rootStore.allIds();
				expect(roots.length > 0).to.be.equal(true, 'Wrong Test Setup');
			});
			it('should create a root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/path/';
				root.id = await rootService.create(root);
				const r = await rootService.rootStore.searchOne({path: '/invalid/test/path/'});
				should().exist(r);
			});
			it('should not allow already scanned path or parts of path in a new root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/path/';
				await rootService.create(root).should.eventually.be.rejectedWith(Error);
				root.path = '/invalid/test/';
				await rootService.create(root).should.eventually.be.rejectedWith(Error);
				root.path = '/invalid/test/path/other';
				await rootService.create(root).should.eventually.be.rejectedWith(Error);
			});
			it('should not allow already scanned path or parts of path in a updated root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/isOK/';
				root.id = await rootService.create(root);
				root.path = '/invalid/test/path/';
				await rootService.update(root).should.eventually.be.rejectedWith(Error);
			});
			it('should update a root', async () => {
				let r = await rootService.rootStore.searchOne({path: '/invalid/test/path/'});
				should().exist(r);
				if (r) {
					r.path = '/invalid/something/different/';
					await rootService.update(r);
					r = await rootService.rootStore.searchOne({path: r.path});
				}
				should().exist(r);
			});
			it('should remove a root', async () => {
				const root = mockRoot();
				root.path = '/invalid/test/toremove/';
				root.id = await rootService.create(root);
				await rootService.remove(root);
				const r = await rootService.rootStore.searchOne({path: root.path});
				should().not.exist(r);
			});
		},
		async () => {
		}
	);
});
