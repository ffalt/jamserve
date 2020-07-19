import {ObjField, ResultType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';

@ResultType({description: 'Chat'})
export class Chat {
	@ObjField({nullable: true, description: 'User Name', isID: true})
	userName!: string;
	@ObjField({description: 'User Id', isID: true})
	userID!: string;
	@ObjField({description: 'Created Timestamp', min: 0, example: examples.timestamp})
	created!: number;
	@ObjField({description: 'Chat Message', example: 'Hello!'})
	message!: string;
}
