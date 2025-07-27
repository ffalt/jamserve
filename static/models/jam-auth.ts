export interface Auth {
	server: string;
	username: string;
	session: boolean;
	token?: string;
	version?: string;
	password?: string;
}
