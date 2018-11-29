import {describe, it} from 'mocha';
import {expect, should} from 'chai';
import {iti} from './contexts';

export function shouldBehaveLikeAUser() {

	// (this: { engine: Engine, user: User }) => void =
	let userID: string;
	iti('should add the user', async function() {
		userID = await this.engine.userService.createUser(this.user);
	});
	iti('should find and compare the created user by ID', async function() {
		const user = await this.engine.userService.getUser(userID);
		should().exist(user);
		expect(user).to.deep.equal(this.user);
	});
	iti('should find and compare the created user by name', async function() {
		const user = await this.engine.store.userStore.searchOne({name: this.user.name});
		should().exist(user);
		expect(user).to.deep.equal(this.user);
	});
	iti('should not allow add an same name user', async function() {
		try {
			const id = await this.engine.userService.createUser(this.user);
			should().not.exist(id);
		} catch (e) {
			should().exist(e);
		}
	});
	iti('should auth and compare the created user', async function() {
		const user = await this.engine.userService.auth(this.user.name, this.user.pass);
		should().exist(user);
		expect(user).to.deep.equal(this.user);
	});
	iti('should not auth the user with the wrong password', async function() {
		try {
			const user = await this.engine.userService.auth(this.user.name, this.user.pass + '_wrong');
			should().not.exist(user);
		} catch (e) {
			should().exist(e);
		}
	});
	iti('should update the created user', async function() {
		const oldname = this.user.name;
		this.user.name = oldname + '_renamed';
		await this.engine.userService.updateUser(this.user);
		const user = await this.engine.userService.getUser(userID);
		should().exist(user);
		expect(user).to.deep.equal(this.user);
		this.user.name = oldname;
		await this.engine.userService.updateUser(this.user);
		const user2 = await this.engine.userService.getUser(userID);
		expect(user2).to.deep.equal(this.user);
	});
	iti('should remove the user', async function() {
		await this.engine.userService.deleteUser(this.user);
		const user = await this.engine.userService.getUser(userID);
		should().not.exist(user);
	});
}
