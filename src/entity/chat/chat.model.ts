import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Chat' })
export class Chat {
	@ObjectField({ description: 'User Name', example: 'Awesome User' })
	userName!: string;

	@ObjectField({ description: 'User Id', isID: true })
	userID!: string;

	@ObjectField({ description: 'Created Timestamp', min: 0, example: examples.timestamp })
	created!: number;

	@ObjectField({ description: 'Chat Message', example: 'Hello!' })
	message!: string;
}
