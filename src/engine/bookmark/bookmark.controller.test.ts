import {JamApi, JamRequest} from '../../api/jam/api';
import {Errors} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {testController, validateJamResponse} from '../base/controller.spec';
import {mockUser} from '../user/user.mock';
import {User} from '../user/user.model';
import {BookmarkController} from './bookmark.controller';

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
					throw Error('Invalid Test Setup');
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
					throw Error('Invalid Test Setup');
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
					throw Error('Invalid Test Setup');
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
					throw Error('Invalid Test Setup');
				}
				const list = await controller.list({query: {}, user});
				await controller.create({query: {trackID: track.id, comment: 'list', position: 55555}, user});
				await controller.create({query: {trackID: track.id, comment: 'list', position: 55555}, user: dummyUser});
				const result = await controller.list({query: {bookmarkTrack: true}, user});
				expect(result.items.length).toBe(list.items.length + 1);
				for (const bookmark of result.items) {
					expect(bookmark.track).toBeTruthy();
				}
			});
		});
		describe('.byTrackList', () => {
			it('should list bookmarks', async () => {
				const track = await api.trackController.trackService.trackStore.random();
				if (!track) {
					throw Error('Invalid Test Setup');
				}
				const list = await controller.byTrackList({query: {trackID: track.id}, user});
				await controller.create({query: {trackID: track.id, comment: 'byTrackList', position: 99999}, user});
				await controller.create({query: {trackID: track.id, comment: 'byTrackList', position: 99999}, user: dummyUser});
				const result = await controller.byTrackList({query: {trackID: track.id}, user});
				expect(result.items.length).toBe(list.items.length + 1);
			});
		});
		describe('.id', () => {
			it('should return error on invalid id parameter', async () => {
				const req = {query: {}, user};
				await expect(controller.id(req as JamRequest<JamParameters.Bookmark>)).rejects.toThrow(Errors.invalidParameter);
				await expect(controller.ids(req as JamRequest<JamParameters.Bookmarks>)).rejects.toThrow(Errors.invalidParameter);
			});
			it('should return 404 for invalid id', async () => {
				const req: JamRequest<JamParameters.Bookmark> = {query: {id: 'invalid'}, user};
				await expect(controller.id(req)).rejects.toThrow(Errors.itemNotFound);
			});
			it('should ignore invalid ids', async () => {
				const req: JamRequest<JamParameters.Bookmarks> = {query: {ids: ['invalid']}, user};
				const list = await controller.ids(req);
				expect(list).toBeTruthy();
				expect(list.items.length).toBe(0); // 'no items should be returned'
			});
			it('should return an bookmark', async () => {
				const track = await api.trackController.trackService.trackStore.random();
				if (!track) {
					throw Error('Invalid Test Setup');
				}
				const bookmark = await controller.create({query: {trackID: track.id, comment: 'byTrackList', position: 33333}, user});
				const req: JamRequest<JamParameters.Bookmark> = {query: {id: bookmark.id, bookmarkTrack: true}, user};
				const result = await controller.id(req);
				expect(result).toBeTruthy();
				expect(result.track).toBeTruthy();
				await validateJamResponse('Jam.Bookmark', result);
			});
		});
	});
});
