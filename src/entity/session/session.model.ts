import {SessionUser} from './session-user.model';
import {ObjField, ResultType} from '../../modules/rest';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';
import {examples} from '../../modules/engine/rest/example.consts';

@ResultType({description: 'Session Data'})
export class Session {
	@ObjField({description: 'Api Version', example: JAMAPI_VERSION})
	version!: string;
	@ObjField(() => [String], {description: 'Allowed Cookie Domains for CORS', example: ['localhost:4040']})
	allowedCookieDomains?: Array<string>;
	@ObjField({nullable: true, description: 'JSON Web Token', example: examples.token})
	jwt?: string;
	@ObjField({nullable: true, description: 'User of this session'})
	user?: SessionUser;
}
