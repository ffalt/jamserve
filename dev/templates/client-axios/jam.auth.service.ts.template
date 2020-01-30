// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {JamConfiguration} from './jam.configuration';
import {HttpHeaders, HTTPOptions, JamHttpService} from './jam.http.service';
import {Jam} from './model/jam-rest-data';
import {Auth} from './model/jam-auth';

export class JamAuthService {
	user?: Jam.SessionUser = undefined;
	auth?: Auth = undefined;
	readonly version = '0.1.12';
	readonly apiPrefix = '/jam/v1/';
	checked: boolean = false;
	loaded: boolean = false;

	constructor(private http: JamHttpService, private configuration: JamConfiguration) {
	}

	async load(): Promise<void> {
		const o = await this.configuration.fromStorage();
		this.user = o ? o.user : undefined;
		this.auth = o ? o.auth : undefined;
		if (this.user) {
			await this.configuration.userChangeNotify(this.user);
		}
		this.loaded = true;
	}

	async check(): Promise<void> {
		this.checked = true;
		if (!this.auth || this.auth.server === undefined) {
			return;
		}
		try {
			const data = await this.http.get<Jam.Session>(`${this.auth.server}${this.apiPrefix}session`, this.getHTTPOptions());
			if (data.user) {
				this.user = data.user;
				this.auth.version = data.version;
				await this.configuration.toStorage({auth: this.auth, user: this.user});
			} else {
				this.user = undefined;
			}
		} catch (e) {
			throw (e || Error('Server error'));
		}
	}

	async canUseSession(server: string): Promise<boolean> {
		const data = await this.http.get<Jam.Session>(`${server}${this.apiPrefix}session`, {withCredentials: false});
		return (data.allowedCookieDomains || []).includes(this.configuration.domain());
	}

	async login(server: string, username: string, password: string, storePassword?: boolean): Promise<void> {
		const canUseSession = await this.canUseSession(server);
		try {
			const data = await this.http.post<Jam.Session>(`${server}${this.apiPrefix}login`, {
				client: this.configuration.clientName,
				username,
				password,
				jwt: !canUseSession
			}, {withCredentials: canUseSession});
			this.user = data.user;
			if (!this.user) {
				return Promise.reject(Error('Invalid Server Response'));
			}
			this.auth = {
				server,
				username: this.user.name,
				session: canUseSession,
				token: !canUseSession ? data.jwt : undefined,
				version: data.version,
				password: storePassword ? password : undefined
			};
			await this.configuration.toStorage({auth: this.auth, user: this.user});
			await this.configuration.userChangeNotify(this.user);
		} catch (e) {
			console.error(e);
			await this.clear();
			if (e.error && e.error.error) {
				throw Error(e.error.error);
			}
			if (e.statusText) {
				throw Error(e.statusText);
			}
			throw Error('Server Error');
		}
	}

	getHTTPHeaders(): HttpHeaders | undefined {
		if (this.auth && this.auth.token) {
			return {Authorization: `Bearer ${this.auth.token}`};
		}
		return undefined;
	}

	getHTTPOptions(): HTTPOptions {
		if (this.auth && this.auth.token) {
			return {withCredentials: false, headers: this.getHTTPHeaders()};
		}
		return {withCredentials: true};
	}

	async logout(): Promise<void> {
		if (this.auth) {
			await this.http.post<{}>(`${this.auth.server}${this.apiPrefix}logout`, {}, this.getHTTPOptions());
		}
		await this.clear();
	}

	async clear(): Promise<void> {
		await this.configuration.toStorage(undefined);
		await this.configuration.userChangeNotify(undefined);
		this.user = undefined;
		this.auth = undefined;
	}

	isLoggedIn(): boolean {
		return !!(this.user && this.auth);
	}

	userRolePodcast(): boolean {
		return !!this.user?.roles?.podcast;
	}

	userRoleAdmin(): boolean {
		return !!this.user?.roles?.admin;
	}

	userRoleUpload(): boolean {
		return !!this.user?.roles?.upload;
	}

	userRoleStream(): boolean {
		return !!this.user?.roles?.stream;
	}
}
