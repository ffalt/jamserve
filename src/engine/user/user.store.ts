import {DBObjectType} from '../../types';
import {hexDecode} from '../../utils/hex';
import {Md5} from 'md5-typescript';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {User} from './user.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryUser extends SearchQuery {
	ids?: Array<string>;
	name?: string;
	isAdmin?: boolean;
}

export class UserStore extends BaseStore<User, SearchQueryUser> {

	constructor(db: Database) {
		super(DBObjectType.user, db);
	}

	protected transformQuery(query: SearchQueryUser): DatabaseQuery {
		const q = new QueryHelper();
		q.terms('id', query.ids);
		q.term('name', query.name);
		q.true('roles.adminRole', query.isAdmin);
		q.match('name', query.query);
		return q.get(query);
	}

	async add(user: User): Promise<string> {
		if (user.pass.indexOf('enc:') === 0) {
			user.pass = hexDecode(user.pass);
		}
		return await this.group.add(user);
	}

	async replace(user: User): Promise<void> {
		if (user.pass.indexOf('enc:') === 0) {
			user.pass = hexDecode(user.pass);
		}
		return await this.group.replace(user.id, user);
	}

	async authToken(name: string, token: string, salt: string): Promise<User> {
		if ((!name) || (!name.length)) {
			return Promise.reject(Error('Invalid Username'));
		}
		if ((!token) || (!token.length)) {
			return Promise.reject(Error('Invalid Token'));
		}
		const user = await this.group.queryOne({term: {'name': name}});
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		const t = Md5.init(user.pass + salt);
		if (token !== t) {
			return Promise.reject(Error('Invalid Token'));
		}
		return user;
	}

	async auth(name: string, pass: string): Promise<User> {
		if ((!name) || (!name.length)) {
			return Promise.reject(Error('Invalid Username'));
		}
		if ((!pass) || (!pass.length)) {
			return Promise.reject(Error('Invalid Password'));
		}
		const user = await this.group.queryOne({term: {'name': name}});
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		if (pass.indexOf('enc:') === 0) {
			pass = hexDecode(pass.slice(4)).trim();
		}
		if (pass !== user.pass) {
			return Promise.reject(Error('Invalid Password'));
		}
		return user;
	}

	async get(name: string): Promise<User | undefined> {
		return await this.group.queryOne({term: {'name': name || ''}});
	}

}
