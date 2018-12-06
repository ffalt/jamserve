import {expect, should, use, assert} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderService} from './folder.service';
import {TestDBs} from '../../db/db.test';
import {Store} from '../../engine/store/store';
import {TestDataStore} from '../../engine/store/store.test';
import path from 'path';
import fse from 'fs-extra';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

before(() => {
	chai.should();
	chai.use(chaiAsPromised);
});

describe('FolderService', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let folderService: FolderService;
			let testStore: TestDataStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					const store = new Store(testDB.database);
					testStore = new TestDataStore(store);
					folderService = new FolderService(store.folderStore, store.trackStore);
					testStore.setup().then(() => done());
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testStore.cleanup();
				await testDB.cleanup();
			});

			beforeEach(function() {
			});

			describe('renameFolder', function() {
				this.timeout(40000);
				it('should do handle invalid parameters', async () => {
					const folders = await folderService.folderStore.all();
					const folder = folders[0];
					await folderService.renameFolder(folder, '').should.eventually.be.rejectedWith(Error);
					await folderService.renameFolder(folder, '.').should.eventually.be.rejectedWith(Error);
					await folderService.renameFolder(folder, '//..*\.').should.eventually.be.rejectedWith(Error);
					await folderService.renameFolder(folder, path.basename(folder.path)).should.eventually.be.rejectedWith(Error);
				});
				it('should rename and update all folder & track paths', async () => {
					const folderIds = await folderService.folderStore.allIds();
					for (const id of folderIds) {
						const folder = await folderService.folderStore.byId(id);
						should().exist(folder);
						if (!folder) {
							return;
						}
						await folderService.renameFolder(folder, path.basename(folder.path) + '_renamed');
						const all = await folderService.folderStore.all();
						for (const f of all) {
							expect(await fse.pathExists(f.path)).to.equal(true, 'path does not exist ' + f.path);
						}
					}
				});

			});

			describe('collectFolderPath', () => {

				it('should do handle invalid parameters', async () => {
					let list = await folderService.collectFolderPath(undefined);
					expect(list.length).to.equal(0);
					list = await folderService.collectFolderPath('invalid');
					expect(list.length).to.equal(0);
				});
				it('should report the right parents', async () => {
					const folders = await folderService.folderStore.all();
					for (const f of folders) {
						const list = await folderService.collectFolderPath(f.id);
						expect(list.length).to.equal(f.tag.level + 1);
						list.forEach((item, index) => {
							expect(f.path.indexOf(item.path)).to.equal(0);
							expect(item.tag.level).to.equal(index);
						});
					}
				});

			});

		});

	}

});

