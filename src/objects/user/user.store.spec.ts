import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {SearchQueryUser, UserStore} from './user.store';
import {User} from './user.model';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';
import {mockUser, mockUser2} from './user.mock';

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
