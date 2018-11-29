import {describe, it} from 'mocha';
import {mockupRoot} from './mockups';
import {expect, should} from 'chai';
import {ite} from './contexts';

export function shouldBehaveLikeALibrary() {
	let rootID: string;
	ite('should add a root folder', async function() {
		const id = await this.engine.rootService.createRoot(mockupRoot);
		should().exist(id);
		rootID = <string>id;
	});
	ite('should find and compare the created root by ID', async function() {
		const root = await this.engine.store.rootStore.byId(rootID);
		should().exist(root);
		expect(root).to.deep.equal(mockupRoot);
	});
	ite('should not allow add an same path root', async function() {
		try {
			const id = await this.engine.rootService.createRoot(mockupRoot);
			should().not.exist(id);
		} catch (e) {
			should().exist(e);
		}
	});
	ite('should update the created root', async function() {
		const oldname = mockupRoot.name;
		mockupRoot.name = oldname + '_renamed';
		await this.engine.rootService.updateRoot(mockupRoot);
		const root = await this.engine.store.rootStore.byId(rootID);
		should().exist(root);
		expect(root).to.deep.equal(mockupRoot);
		mockupRoot.name = oldname;
		await this.engine.rootService.updateRoot(mockupRoot);
		const root2 = await this.engine.store.rootStore.byId(rootID);
		expect(root2).to.deep.equal(mockupRoot);
	});
	ite('should remove the root', async function() {
		await this.engine.rootService.removeRoot(mockupRoot);
		const root = await this.engine.store.rootStore.byId(mockupRoot.id);
		should().not.exist(root);
	});
	ite('should add the root folder again', async function() {
		rootID = await this.engine.rootService.createRoot(mockupRoot);
	});
	ite('should scan the root folder', async function() {
		await this.engine.rootService.refreshRoot(mockupRoot);
	}).timeout(30000);
	ite('should have scanned all files', async function() {
		const tracks = await this.engine.store.trackStore.search({});
		expect(tracks.length).to.equal(9); // TODO define library test specs
	});
	ite('should have scanned all folders', async function() {
		const folders = await this.engine.store.folderStore.search({});
		expect(folders.length).to.equal(3); // TODO define library test specs
	});
	ite('should have scanned all artists', async function() {
		const artists = await this.engine.store.artistStore.search({});
		expect(artists.length).to.equal(1); // TODO define library test specs
	});
	ite('should have scanned all albums', async function() {
		const albums = await this.engine.store.albumStore.search({});
		expect(albums.length).to.equal(1); // TODO define library test specs
	});
	ite('should remove the root and all its scanned track|folder|album|artist|..., ', async function() {
		await this.engine.rootService.removeRoot(mockupRoot);
		const root = await this.engine.store.rootStore.byId(mockupRoot.id);
		mockupRoot.id = '';
		const stores = [this.engine.store.folderStore, this.engine.store.trackStore, this.engine.store.artistStore, this.engine.store.albumStore, this.engine.store.stateStore, this.engine.store.bookmarkStore];
		for (const store of stores) {
			const count = await store.count();
			expect(count).to.equal(0);
		}
	});
}
