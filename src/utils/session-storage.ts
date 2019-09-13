import {Express} from 'express';
import {Store} from 'express-session';
import fse from 'fs-extra';
import path from 'path';

export class SessionJSONFileStore extends Store {
	filename: string;
	cache = new Map<string, Express.SessionData>();

	constructor(filename: string) {
		super();
		this.filename = path.resolve(filename || 'sessions.json');
		this.init().catch(e => {
			console.error('SessionJSONFileStore', e);
		});
	}

	async init(): Promise<void> {
		await fse.ensureDir(path.dirname(this.filename));
		const exists = await fse.pathExists(this.filename);
		if (exists) {
			const archive = await fse.readJson(this.filename);
			Object.keys(archive).forEach(key => {
				const sessionData = archive[key];
				if (sessionData.cookie.expires !== undefined && typeof sessionData.cookie.expires !== 'boolean') {
					sessionData.cookie.expires = new Date(sessionData.cookie.expires);
				}
				if (!this.expired(sessionData)) {
					this.cache.set(key, sessionData);
				}
			});
		}
	}

	private cacheAsObj(): { [id: string]: Express.SessionData } {
		const result: { [id: string]: Express.SessionData } = {};
		for (const c of this.cache) {
			result[c[0]] = c[1];
		}
		return result;
	}

	private expired(data: Express.SessionData): boolean {
		if (data.cookie && data.cookie.expires instanceof Date) {
			return data.cookie.expires.valueOf() < Date.now();
		}
		return false;
	}

	private savejson(callback?: (err?: Error) => void): void {
		fse.writeFile(this.filename, JSON.stringify(this.cacheAsObj()), err => {
			if (callback) {
				callback(err);
			}
		});
	}

	get: (sid: string, callback: (err: any, data?: Express.SessionData | null) => void) => void = (sid, callback) => {
		const sessionData = this.cache.get(sid);
		if (sessionData && this.expired(sessionData)) {
			return this.destroy(sid, err => {
				callback(err);
			});
		}
		callback(null, sessionData);
	};

	set: (sid: string, data: Express.SessionData, callback?: (err?: any) => void) => void = (sid, data, callback) => {
		this.cache.set(sid, data);
		this.savejson(callback);
	};

	destroy: (sid: string, callback?: (err?: any) => void) => void = (sid, callback) => {
		this.cache.delete(sid);
		this.savejson(callback);
	};

	all: (callback: (err: any, obj?: { [sid: string]: Express.SessionData; } | null) => void) => void = callback => {
		callback(null, this.cacheAsObj());
	};

	length: (callback: (err: any, length?: number | null) => void) => void = callback => {
		callback(null, Object.keys(this.cache).length);
	};

	clear: (callback?: (err?: any) => void) => void = callback => {
		this.cache.clear();
		this.savejson(callback);
	};

	// touch: (sid: string, session: Express.Session, callback?: (err?: any) => void) => void = (sid, session, callback) => {
	// 	this.set(sid, session, callback);
	// };

}
