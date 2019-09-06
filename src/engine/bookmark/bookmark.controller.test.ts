import {JamApi} from '../../api/jam/api';
import {testController} from '../base/controller.spec';
import {User} from '../user/user.model';
import {BookmarkController} from './bookmark.controller';
import {Errors} from '../../api/jam/error';
import {mockUser} from '../user/user.mock';

describe('BookmarkController', () => {
	let controller: BookmarkController;
	let api: JamApi;
	let user: User;
	const dummyUser = mockUser();
	testController({}, async (jamApi, jamUser) => {
		dummyUser.id = 'dummyInvalid';
		controller = jamApi.bookmarkController;
		user = jamUser;
		api = jamApi;
	}, () => {
		describe('.create', () => {
			it('should fail create for non existing track', async () => {
				await expect(controller.create({query: {trackID: 'dummyID', comment: 'create', position: 12345}, user})).rejects.toThrow(Errors.itemNotFound);
			});
			it('should create a bookmark', async () => {
				const track = await api.trackController.trackService.trackStore.random();
				if (!track) {
					throw Error('Wrong Test Setup');
				}
				const bookmark = await controller.create({query: {trackID: track.id, comment: 'hello', position: 12345}, user});
				expect(bookmark).toBeTruthy();
			});
		});
		describe('.delete', () => {
			it('should delete an invalid bookmark', async () => {
				await controller.delete({query: {id: 'invalid'}, user});
			});
			it('should delete a bookmark', async () => {
				const track = await api.trackController.trackService.trackStore.random();
				if (!track) {
					throw Error('Wrong Test Setup');
				}
				const bookmark = await controller.create({query: {trackID: track.id, comment: 'delete', position: 54321}, user});
				expect(bookmark).toBeTruthy();
				await controller.delete({query: {id: bookmark.id}, user});
				const none = await controller.bookmarkService.bookmarkStore.byId(bookmark.id);
				expect(none).toBeUndefined();
			});
		});
		describe('.byTrackDelete', () => {
			it('should delete an invalid bookmark', async () => {
				await controller.byTrackDelete({query: {trackID: 'invalid'}, user});
			});
			it('should delete all bookmark', async () => {
				const track = await api.trackController.trackService.trackStore.random();
				if (!track) {
					throw Error('Wrong Test Setup');
				}
				let bookmark = await controller.create({query: {trackID: track.id, comment: 'byTrackDelete', position: 54321}, user});
				const mustStay = await controller.create({query: {trackID: track.id, comment: 'byTrackDelete', position: 54321}, user: dummyUser});
				expect(bookmark).toBeTruthy();
				bookmark = await controller.create({query: {trackID: track.id, comment: 'byTrackDelete', position: 34567}, user});
				expect(bookmark).toBeTruthy();
				await controller.byTrackDelete({query: {trackID: track.id}, user});
				const list = await controller.bookmarkService.byTrack(track.id, user.id);
				expect(list.items.length).toBe(0);
				expect(await controller.bookmarkService.bookmarkStore.byId(mustStay.id)).toBeTruthy();
			});
		});
		describe('.list', () => {
			it('should list bookmarks', async () => {
				const track = await api.trackController.trackService.trackStore.random();
				if (!track) {
					throw Error('Wrong Test Setup');
				}
				const list = await controller.list({query: {}, user});
				await controller.create({query: {trackID: track.id, comment: 'list', position: 55555}, user});
				await controller.create({query: {trackID: track.id, comment: 'list', position: 55555}, user: dummyUser});
				const result = await controller.list({query: {}, user});
				expect(result.items.length).toBe(list.items.length + 1);
			});
		});
		describe('.byTrackList', () => {
			it('should list bookmarks', async () => {
				const track = await api.trackController.trackService.trackStore.random();
				if (!track) {
					throw Error('Wrong Test Setup');
				}
				const list = await controller.byTrackList({query: {trackID: track.id}, user});
				await controller.create({query: {trackID: track.id, comment: 'byTrackList', position: 99999}, user});
				await controller.create({query: {trackID: track.id, comment: 'byTrackList', position: 99999}, user: dummyUser});
				const result = await controller.byTrackList({query: {trackID: track.id}, user});
				expect(result.items.length).toBe(list.items.length + 1);
			});
		});
	});
});
