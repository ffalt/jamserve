import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

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
