declare namespace Express {

	export interface SessionData {
		passport: { user: string };
		jwth?: string;
		client: string;
		userAgent: string;
	}

}
