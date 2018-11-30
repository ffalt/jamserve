import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {UserStore, SearchQueryUser} from './user.store';
import {User} from './user.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';

function mockUser(): User {
	return {
		id: '',
		type: DBObjectType.user,
		name: 'a name',
		pass: 'a pass',
		email: 'a@mail',
		created: 1543495268,
		scrobblingEnabled: false,
		avatarLastChanged: 1543495269,
		avatar: 'userID1.jpg',
		maxBitRate: 10,
		allowedfolder: [],
		roles: {
			adminRole: false,
			podcastRole: false,
			streamRole: false,
			uploadRole: false
		}
	};
}

function mockUser2(): User {
	return {
		id: '',
		type: DBObjectType.user,
		name: 'second name',
		pass: 'second pass',
		email: 'second@mail',
		created: 1443495268,
		scrobblingEnabled: true,
		avatarLastChanged: 1443495269,
		avatar: 'userID2.jpg',
		maxBitRate: 20,
		allowedfolder: [],
		roles: {
			adminRole: true,
			podcastRole: true,
			streamRole: true,
			uploadRole: true
		}
	};
}

describe('UserStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let userStore: UserStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					userStore = new UserStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = userStore;
				this.generateMockObjects = () => {
					return [mockUser(), mockUser2()];
				};
				this.generateMatchingQueries = (mock: User) => {
					const matches: Array<SearchQueryUser> = [
						{id: mock.id},
						{ids: [mock.id]},
						{name: mock.name},
						{isAdmin: mock.roles.adminRole},
						{query: mock.name[0]}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});
