import { SessionUser } from './session-user.model.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Session Data' })
export class Session {
	@ObjectField({ description: 'Api Version', example: JAMAPI_VERSION })
	version!: string;

	@ObjectField(() => [String], { nullable: true, description: 'Allowed Cookie Domains for CORS', example: ['localhost:4040'] })
	allowedCookieDomains?: Array<string>;

	@ObjectField({ nullable: true, description: 'JSON Web Token', example: examples.token })
	jwt?: string;

	@ObjectField({ nullable: true, description: 'User of this session' })
	user?: SessionUser;
}
