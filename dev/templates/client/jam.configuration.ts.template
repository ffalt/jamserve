// THIS FILE IS GENERATED, DO NOT EDIT MANUALLY

import {Auth} from './jam.auth.service';
import {Jam} from './model/jam-rest-data';

export abstract class JamConfiguration {
	clientName: string;
	forceSessionUsage: boolean;

	abstract domain(): string;

	abstract userChangeNotify(user: Jam.SessionUser | undefined): Promise<void>;

	abstract fromStorage(): Promise<{ user: Jam.SessionUser, auth: Auth } | undefined>;

	abstract toStorage(data: { user: Jam.SessionUser, auth: Auth } | undefined): Promise<void>;

}
