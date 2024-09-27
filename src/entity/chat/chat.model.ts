import {examples} from '../../modules/engine/rest/example.consts.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ResultType({description: 'Chat'})
export class Chat {
	@ObjField({description: 'User Name', example: 'Awesome User'})
	userName!: string;
	@ObjField({description: 'User Id', isID: true})
	userID!: string;
	@ObjField({description: 'Created Timestamp', min: 0, example: examples.timestamp})
	created!: number;
	@ObjField({description: 'Chat Message', example: 'Hello!'})
	message!: string;
}
