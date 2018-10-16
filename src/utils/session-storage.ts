import fs from 'fs';
import path from 'path';
import {Store} from 'express-session';
import {Express} from 'express';

export interface Sessions {
	[key: string]: Express.SessionData;
}

export class SessionJSONFileStore extends Store {
	filename: string;
	cache: Sessions = {};

	constructor(filename: string) {
		super();
		this.filename = filename || 'sessions.json';

		fs.mkdir(path.dirname(filename), (err) => {
			if (err && err.code !== 'EEXIST') {
				throw err;
			}
			fs.readFile(filename, 'utf8', (err2, data) => {
				if (err2 && err2.code !== 'ENOENT') {
					throw err2;
				}
				if ((!err2) && (data)) {
					this.cache = {};
					const archive = JSON.parse(data.toString());
					Object.keys(archive).forEach(key => {
						const sessionData = archive[key];
						if (sessionData.cookie.expires !== undefined && typeof sessionData.cookie.expires !== 'boolean') {
							sessionData.cookie.expires = new Date(sessionData.cookie.expires);
						}
						if (!this.expired(sessionData)) {
							this.cache[key] = sessionData;
						}
					});
				}
			});
		});
	}

	get: (sid: string, callback: (err: any, data?: Express.SessionData | null) => void) => void = (sid, callback) => {
		const sessionData = this.cache[sid];
		if (sessionData && this.expired(sessionData)) {
			return this.destroy(sid, (err) => {
				callback(err);
			});
		}
		callback(null, sessionData);
	};

	set: (sid: string, data: Express.SessionData, callback?: (err?: any) => void) => void = (sid, data, callback) => {
		this.cache[sid] = data;
		this.savejson(callback);
	};

	destroy: (sid: string, callback?: (err?: any) => void) => void = (sid, callback) => {
		delete this.cache[sid];
		this.savejson(callback);
	};

	all: (callback: (err: any, obj?: { [sid: string]: Express.SessionData; } | null) => void) => void = (callback) => {
		callback(null, this.cache);
	};

	length: (callback: (err: any, length?: number | null) => void) => void = (callback) => {
		callback(null, Object.keys(this.cache).length);
	};

	clear: (callback?: (err?: any) => void) => void = (callback) => {
		this.cache = {};
		this.savejson(callback);
	};

	// touch: (sid: string, session: Express.Session, callback?: (err?: any) => void) => void = (sid, session, callback) => {
	// 	this.set(sid, session, callback);
	// };

	private expired(data: Express.SessionData): boolean {
		if (data.cookie && data.cookie.expires instanceof Date) {
			return data.cookie.expires.valueOf() < Date.now();
		}
		return false;
	}

	private savejson(callback?: (err?: Error) => void): void {
		fs.writeFile(this.filename, JSON.stringify(this.cache), (err) => {
			if (callback) {
				callback(err);
			}
		});
	}

}

