import {describe, it} from 'mocha';
import {should} from 'chai';
import {shouldBehaveLikeAUser} from './user';
import {mockupAdmin, mockupRoot, mockupUser} from './mockups';
import {shouldBehaveLikaAUserLibrary} from './user-library';
import {shouldBehaveLikeAJamApi} from './jam-api';
import {ite} from './contexts';
import {shouldBehaveLikeALibrary} from './library';

export function shouldBehaveLikeAEngine() {
	describe('init', () => {
		ite('should start', async function() {
			await this.engine.start();
		}).timeout(30000);
		ite('should drop any previous data', async function() {
			await this.engine.store.reset();
		}).timeout(30000);
		ite('should start empty engine', async function() {
			await this.engine.start();
		}).timeout(30000);
	});
	describe('user admin', function() {
		before(function(done) {
			this.userController = mockupAdmin;
			done();
		});
		shouldBehaveLikeAUser();
	});
	describe('user user', function() {
		before(function(done) {
			this.userController = mockupUser;
			done();
		});
		shouldBehaveLikeAUser();
	});
	describe('library', function() {
		shouldBehaveLikeALibrary();
	});
	describe('user-library', function() {
		before(function(done) {
			this.userController = mockupAdmin;
			this.rootController = mockupRoot;
			done();
		});
		shouldBehaveLikaAUserLibrary();
	});
	describe('jam-api', function() {
		shouldBehaveLikeAJamApi();
	});
	describe('stop', () => {
		ite('should stop', async function() {
			this.engine.stop();
		});
	});

}
