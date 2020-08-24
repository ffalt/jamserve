import {State} from '../state/state.model';
import {ObjField, ResultType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';

@ResultType()
export class Base {
	@ObjField({description: 'ID', isID: true})
	id!: string;
	@ObjField({description: 'Name', example: 'Awesome'})
	name!: string;
	@ObjField({nullable: true, description: 'User State Info'})
	state?: State;
	@ObjField({description: 'Created Timestamp', min: 0, example: examples.timestamp})
	created!: number;
}

@ResultType()
export class Page {
	@ObjField({nullable: true, description: 'Items starting from offset position', min: 0, example: 0})
	skip?: number;
	@ObjField({nullable: true, description: 'Amount of returned items', min: 0, example: 25})
	take?: number;
	@ObjField({nullable: true, description: 'Total amount of available items', min: 0, example: 123})
	total?: number;
}
