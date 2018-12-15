import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {SearchQueryUser, UserStore} from './user.store';
import {User} from './user.model';
import {testStore} from '../base/base.store.spec';
import {mockUser, mockUser2} from './user.mock';

describe('UserStore', () => {
	let userStore: UserStore;
	testStore((testDB) => {
		userStore = new UserStore(testDB.database);
		return userStore;
	}, () => {
		return [mockUser(), mockUser2()];
	}, (mock: User) => {
		const matches: Array<SearchQueryUser> = [
			{id: mock.id},
			{ids: [mock.id]},
			{name: mock.name},
			{isAdmin: mock.roles.adminRole},
			{query: mock.name[0]}
		];
		return matches;
	}, () => {
	});
});
