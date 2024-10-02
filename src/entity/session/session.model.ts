import { SessionUser } from './session-user.model.js';
import { ObjField, ResultType } from '../../modules/rest/index.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { examples } from '../../modules/engine/rest/example.consts.js';

@ResultType({ description: 'Session Data' })
export class Session {
	@ObjField({ description: 'Api Version', example: JAMAPI_VERSION })
	version!: string;

	@ObjField(() => [String], { description: 'Allowed Cookie Domains for CORS', example: ['localhost:4040'] })
	allowedCookieDomains?: Array<string>;

	@ObjField({ nullable: true, description: 'JSON Web Token', example: examples.token })
	jwt?: string;

	@ObjField({ nullable: true, description: 'User of this session' })
	user?: SessionUser;
}
