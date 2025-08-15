import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'User State Data' })
export class State {
	@ObjectField({ nullable: true, description: 'Number of Plays', min: 0, example: 5 })
	played?: number;

	@ObjectField({ nullable: true, description: 'Last Played Timestamp', min: 0, example: examples.timestamp })
	lastPlayed?: number;

	@ObjectField({ nullable: true, description: 'Faved Timestamp', min: 0, example: examples.timestamp })
	faved?: number;

	@ObjectField({ nullable: true, description: 'User Rating', min: 0, max: 5, example: 5 })
	rated?: number;
}

@ResultType({ description: 'User StateInfo Data' })
export class StateInfo {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField(() => State, { description: 'State' })
	state!: State;
}

@ResultType({ description: 'User States Data' })
export class States {
	@ObjectField(() => [StateInfo], { description: 'List of State Infos' })
	states!: Array<StateInfo>;
}
