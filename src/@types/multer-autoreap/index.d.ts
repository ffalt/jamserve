declare module 'multer-autoreap' {
	import {NextFunction, Request, Response} from 'express';

	interface MulterAutoReap {
		// tslint:disable-next-line:callable-types
		(req: Request, res: Response, next: NextFunction): void;
	}

	const autoReap: MulterAutoReap;
	export = autoReap;
}
