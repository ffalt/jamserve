import { State } from '../state/state.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType()
export class Base {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Awesome' })
	name!: string;

	@ObjectField({ nullable: true, description: 'User State Info' })
	state?: State;

	@ObjectField({ description: 'Created Timestamp', min: 0, example: examples.timestamp })
	created!: number;
}

@ResultType()
export class Page {
	@ObjectField({ nullable: true, description: 'Items starting from offset position', min: 0, example: 0 })
	skip?: number;

	@ObjectField({ nullable: true, description: 'Amount of returned items', min: 0, example: 25 })
	take?: number;

	@ObjectField({ nullable: true, description: 'Total amount of available items', min: 0, example: 123 })
	total?: number;
}
