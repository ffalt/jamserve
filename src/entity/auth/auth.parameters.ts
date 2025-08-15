import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class CredentialsParameters {
	@ObjectField({ description: 'User password', example: 'secret' })
	password!: string;

	@ObjectField({ description: 'User name', example: 'you' })
	username!: string;

	@ObjectField({ description: 'User client', example: 'Jamberry v1' })
	client!: string;

	@ObjectField({ nullable: true, description: 'Generate JSON Web Token', example: true })
	jwt?: boolean;
}
