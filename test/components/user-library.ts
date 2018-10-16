import {describe, it} from 'mocha';
import {expect, should} from 'chai';
import {Engine} from '../../src/engine/engine';
import {JamServe} from '../../src/model/jamserve';
import {BaseStore} from '../../src/store/store';
import {DBObjectType} from '../../src/types';

interface EngineUserThis extends Mocha.Context {
	engine: Engine;
	user: JamServe.User;
	root: JamServe.Root;
}

type EngineUserFunc = (this: EngineUserThis, done: Mocha.Done) => void;

interface EngineUserTestFunction extends Mocha.TestFunction {
	(fn: EngineUserFunc): Mocha.Test;

	(title: string, fn: EngineUserFunc): Mocha.Test;
}

const iti: EngineUserTestFunction = <EngineUserTestFunction>it;

export function shouldBehaveLikeARootFolderAdd() {
	iti('should add the root folder', async function() {
		const id = await this.engine.roots.createRoot(this.root);
		should().exist(id);
	});
	iti('should scan the root folder', async function() {
		await this.engine.refreshRoot(this.root);
	}).timeout(30000);
}

function getStore(engine: Engine, name: string): BaseStore<JamServe.DBObject, JamServe.SearchQuery> {
	return <BaseStore<JamServe.DBObject, JamServe.SearchQuery>>(<any>engine.store)[name];
}

function shouldBehaveLikeAFavRateUser() {
	const list: Array<{ name: string, type: DBObjectType }> = [
		{name: 'track', type: DBObjectType.track},
		{name: 'folder', type: DBObjectType.folder},
		{name: 'artist', type: DBObjectType.artist},
		{name: 'album', type: DBObjectType.album}
	];

	list.forEach(set => {
		iti('should fav a ' + set.name, async function() {
			const item = await getStore(this.engine, set.name).searchOne({});
			should().exist(item);
			if (item) {
				await this.engine.fav(item.id, set.type, this.user.id, false);
			}
		});
		iti('should find and unfav the fav ' + set.name, async function() {
			const items = await this.engine.getFilteredListFaved(set.type, {}, this.user, getStore(this.engine, set.name));
			expect(items.length).to.equal(1);
			await this.engine.fav(items[0], set.type, this.user.id, true);
		});
		iti('should not find any fav ' + set.name, async function() {
			const items = await this.engine.getFilteredListFaved(set.type, {}, this.user, getStore(this.engine, set.name));
			expect(items.length).to.equal(0);
		});
		iti('should fav again a ' + set.name, async function() {
			const item = await getStore(this.engine, set.name).searchOne({});
			should().exist(item);
			if (item) {
				await this.engine.fav(item.id, set.type, this.user.id, false);
			}
		});
		iti('should rate a ' + set.name, async function() {
			const item = await getStore(this.engine, set.name).searchOne({});
			should().exist(item);
			if (item) {
				await this.engine.rate(item.id, set.type, this.user.id, 1);
			}
		});
		iti('should find and unrate the rate ' + set.name, async function() {
			const items = await this.engine.getFilteredListHighestRated(set.type, {}, this.user, getStore(this.engine, set.name));
			expect(items.length).to.equal(1);
			await this.engine.rate(items[0], set.type, this.user.id, 0);
		});
		iti('should not find any ratings ' + set.name, async function() {
			const items = await this.engine.getFilteredListHighestRated(set.type, {}, this.user, getStore(this.engine, set.name));
			expect(items.length).to.equal(0);
		});
		iti('should rate again a ' + set.name, async function() {
			const item = await getStore(this.engine, set.name).searchOne({});
			should().exist(item);
			if (item) {
				await this.engine.rate(item.id, set.type, this.user.id, 1);
			}
		});
	});
}

function shouldBehaveLikeABookmarkUser() {
	let track: JamServe.Track;
	iti('should find a track', async function() {
		const t = await this.engine.store.track.searchOne({});
		should().exist(t);
		track = <JamServe.Track>t;
	});
	iti('should add a track bookmark', async function() {
		await this.engine.trackBookmarkCreate(track, this.user, 1, 'a comment');
	});
	iti('should find, compare & remove the track bookmark', async function() {
		const bookmarks = await this.engine.store.bookmark.search({userID: this.user.id});
		should().exist(bookmarks);
		expect(bookmarks.length).to.equal(1);
		const bookmark = bookmarks[0];
		if (bookmark) {
			expect(bookmark.destID).to.equal(track.id);
			expect(bookmark.position).to.equal(1);
			expect(bookmark.comment).to.equal('a comment');
			await this.engine.trackBookmarkRemove(track.id, this.user);
		}
	});
	iti('should not find any track bookmark', async function() {
		const bookmarks = await this.engine.store.bookmark.search({userID: this.user.id});
		expect(bookmarks.length).to.equal(0);
	});
	iti('should add a track bookmark again', async function() {
		await this.engine.trackBookmarkCreate(track, this.user, 2, 'a comment');
	});
}

function shouldBehaveLikeAPlaylistUser() {
	let track: JamServe.Track;
	iti('should find a track', async function() {
		const t = await this.engine.store.track.searchOne({});
		should().exist(t);
		track = <JamServe.Track>t;
	});
	iti('should add a playlist', async function() {
		const playlist = await this.engine.playlists.createPlaylist('playlist', 'a comment', false, this.user.id, [track.id]);
		should().exist(playlist);
	});
	iti('should find, compare & remove the playlist', async function() {
		const playlist = await this.engine.store.playlist.searchOne({userID: this.user.id});
		should().exist(playlist);
		if (playlist) {
			expect(playlist.name).to.equal('playlist');
			expect(playlist.comment).to.equal('a comment');
			expect(playlist.isPublic).to.equal(false);
			expect(playlist.trackIDs).to.eql([track.id]);
			await this.engine.playlists.removePlaylist(playlist);
		}
	});
	iti('should not find any playlist', async function() {
		const playlists = await this.engine.store.playlist.search({userID: this.user.id});
		expect(playlists.length).to.equal(0);
	});

	iti('should add a playlist again', async function() {
		const playlist = await this.engine.playlists.createPlaylist('playlist', 'a comment', false, this.user.id, [track.id]);
		should().exist(playlist);
	});
}

export function shouldBehaveLikaAUserLibrary() {

	iti('should add a user', async function() {
		const id = await this.engine.users.createUser(this.user);
		should().exist(id);
	});

	shouldBehaveLikeARootFolderAdd();
	shouldBehaveLikeAFavRateUser();
	shouldBehaveLikeABookmarkUser();
	shouldBehaveLikeAPlaylistUser();
	iti('should remove the root and all its scanned track|folder|album|artist|..., ', async function() {
		await this.engine.roots.removeRoot(this.root);
		const root = await this.engine.store.root.byId(this.root.id);
		should().not.exist(root);
		this.root.id = '';
		const stores = [this.engine.store.folder, this.engine.store.track, this.engine.store.artist, this.engine.store.album, this.engine.store.state, this.engine.store.bookmark, this.engine.store.playlist];
		for (const store of stores) {
			const count = await store.count();
			expect(count).to.equal(0, 'store of type ' + store.type + ' is not empty');
		}
	});

	shouldBehaveLikeARootFolderAdd();
	shouldBehaveLikeAFavRateUser();
	shouldBehaveLikeABookmarkUser();
	shouldBehaveLikeAPlaylistUser();

	// TODO: add playqueue
	iti('should remove the user and all state|bookmark|playlists|playqueue, ', async function() {
		await this.engine.users.deleteUser(this.user);
		const stores = [this.engine.store.state, this.engine.store.bookmark, this.engine.store.playlist, this.engine.store.playqueue];
		for (const store of stores) {
			const count = await store.count();
			expect(count).to.equal(0, 'store of type ' + store.type + ' is not empty');
		}
	});

}

/*
function testSuiteUserLibraryPlayQueue() {
	let track: JamServe.Track;
	iti('should find a track', async function() {
		const t = await this.engine.store.track.searchOne({});
		should().exist(t);
		track = <JamServe.Track>t;
	});
	iti('should add a playqueue', async function() {
		const playlist = await this.engine.playlists.createPlaylist('playlist', 'a comment', false, this.user.id, [track.id]);
		should().exist(playlist);
	});
	iti('should find, compare & remove the playqueue', async function() {
		const playlist = await this.engine.store.playlist.searchOne({userID: this.user.id});
		should().exist(playlist);
		if (playlist) {
			expect(playlist.name).to.equal('playlist');
			expect(playlist.comment).to.equal('a comment');
			expect(playlist.isPublic).to.equal(false);
			expect(playlist.trackIDs).to.eql([track.id]);
			await this.engine.playlists.removePlaylist(playlist);
		}
	});
	iti('should not find any playqueue', async function() {
		const playlists = await this.engine.store.playlist.search({userID: this.user.id});
		expect(playlists.length).to.equal(0);
	});

	iti('should add a playqueue again', async function() {
		const playlist = this.engine.playlists.createPlaylist('playlist', 'a comment', false, this.user.id, [track.id]);
		should().exist(playlist);
	});
}
*/
