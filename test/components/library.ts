import {describe, it} from 'mocha';
import {mockupRoot} from './mockups';
import {expect, should} from 'chai';
import {ite} from './contexts';

export function shouldBehaveLikeALibrary() {
	let rootID: string;
	ite('should add a root folder', async function() {
		const id = await this.engine.roots.createRoot(mockupRoot);
		should().exist(id);
		rootID = <string>id;
	});
	ite('should find and compare the created root by ID', async function() {
		const root = await this.engine.store.root.byId(rootID);
		should().exist(root);
		expect(root).to.deep.equal(mockupRoot);
	});
	ite('should not allow add an same path root', async function() {
		try {
			const id = await this.engine.roots.createRoot(mockupRoot);
			should().not.exist(id);
		} catch (e) {
			should().exist(e);
		}
	});
	ite('should update the created root', async function() {
		const oldname = mockupRoot.name;
		mockupRoot.name = oldname + '_renamed';
		await this.engine.roots.updateRoot(mockupRoot);
		const root = await this.engine.store.root.byId(rootID);
		should().exist(root);
		expect(root).to.deep.equal(mockupRoot);
		mockupRoot.name = oldname;
		await this.engine.roots.updateRoot(mockupRoot);
		const root2 = await this.engine.store.root.byId(rootID);
		expect(root2).to.deep.equal(mockupRoot);
	});
	ite('should remove the root', async function() {
		await this.engine.roots.removeRoot(mockupRoot);
		const root = await this.engine.store.root.byId(mockupRoot.id);
		should().not.exist(root);
	});
	ite('should add the root folder again', async function() {
		rootID = await this.engine.roots.createRoot(mockupRoot);
	});
	ite('should scan the root folder', async function() {
		await this.engine.refreshRoot(mockupRoot);
	}).timeout(30000);
	ite('should have scanned all files', async function() {
		const tracks = await this.engine.store.track.search({});
		expect(tracks.length).to.equal(9); // TODO define library test specs
	});
	ite('should have scanned all folders', async function() {
		const folders = await this.engine.store.folder.search({});
		expect(folders.length).to.equal(3); // TODO define library test specs
	});
	ite('should have scanned all artists', async function() {
		const artists = await this.engine.store.artist.search({});
		expect(artists.length).to.equal(1); // TODO define library test specs
	});
	ite('should have scanned all albums', async function() {
		const albums = await this.engine.store.album.search({});
		expect(albums.length).to.equal(1); // TODO define library test specs
	});
	ite('should remove the root and all its scanned track|folder|album|artist|..., ', async function() {
		await this.engine.roots.removeRoot(mockupRoot);
		const root = await this.engine.store.root.byId(mockupRoot.id);
		mockupRoot.id = '';
		const stores = [this.engine.store.folder, this.engine.store.track, this.engine.store.artist, this.engine.store.album, this.engine.store.state, this.engine.store.bookmark];
		for (const store of stores) {
			const count = await store.count();
			expect(count).to.equal(0);
		}
	});
}
