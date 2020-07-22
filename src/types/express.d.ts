import {Orm} from '../modules/engine/services/orm.service';

declare namespace Express {

	export interface SessionData {
		passport: { user: string };
		jwth?: string;
		client: string;
		userAgent: string;
	}

}
