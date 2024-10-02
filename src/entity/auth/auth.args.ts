import { ObjField, ObjParamsType } from '../../modules/rest/index.js';

@ObjParamsType()
export class CredentialsArgs {
	@ObjField({ description: 'User password', example: 'secret' })
	password!: string;

	@ObjField({ description: 'User name', example: 'you' })
	username!: string;

	@ObjField({ description: 'User client', example: 'Jamberry v1' })
	client!: string;

	@ObjField({ nullable: true, description: 'Generate JSON Web Token', example: true })
	jwt?: boolean;
}
