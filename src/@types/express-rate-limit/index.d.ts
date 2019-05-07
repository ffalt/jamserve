declare module 'express-rate-limit' {
	import {NextFunction, Request, RequestHandler, Response} from 'express';

	interface Options {
		max?: number;
		message?: string;
		headers?: boolean;
		windowMs?: number;
		store?: Store | any;
		statusCode?: number;
		skipFailedRequests?: boolean;
		skipSuccessfulRequests?: boolean;

		skip?(req?: Request, res?: Response): boolean;

		onLimitReached?(req?: Request, res?: Response): void;

		handler?(req: Request, res: Response, next?: NextFunction): void;

		keyGenerator?(req: Request, res?: Response): string | Request['ip'];
	}

	interface Store {
		hits: {
			[key: string]: number;
		};
		resetTime: number;
		setInterval: NodeJS.Timeout;

		// constructor(windowMs: number);
		resetAll(): void;

		resetKey(key: string | any): void;

		decrement(key: string | any): void;

		incr(key: string | any, cb: (err?: Error, hits?: number) => void): void;
	}

	function limit(options?: Options): RequestHandler;

	export = limit;
}
