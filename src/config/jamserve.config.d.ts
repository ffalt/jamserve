type LogLevel = 'error' | 'warn' | 'info' | 'debug';
type DBType = 'sqlite';

export interface DBConfig {
	use: DBType;
	options: any;
}

export interface ServerConfig {
	listen: string;
	port: number;
	session: {
		allowedCookieDomains: Array<string>;
		secret: string;
		cookie: {
			name: string;
			secure: boolean;
			proxy: boolean;
			maxAge: {
				value: number;
				unit: string;
			};
		};
	};
	jwt: {
		secret: string;
		maxAge: {
			value: number;
			unit: string;
		};
	};
	limit: {
		login: {
			max: number;
			window: number;
		};
		api: {
			max: number;
			window: number;
		};
	};
}

export interface JamServeConfig {
	log: { level: LogLevel };
	server: ServerConfig;
	database: DBConfig;
	paths: {
		data: string;
		frontend: string;
	};
}
