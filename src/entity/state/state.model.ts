import {ObjField, ResultType} from '../../modules/rest/index.js';
import {examples} from '../../modules/engine/rest/example.consts.js';

@ResultType({description: 'User State Data'})
export class State {
	@ObjField({nullable: true, description: 'Number of Plays', min: 0, example: 5})
	played?: number;
	@ObjField({nullable: true, description: 'Last Played Timestamp', min: 0, example: examples.timestamp})
	lastPlayed?: number;
	@ObjField({nullable: true, description: 'Faved Timestamp', min: 0, example: examples.timestamp})
	faved?: number;
	@ObjField({nullable: true, description: 'User Rating', min: 0, max: 5, example: 5})
	rated?: number;
}

@ResultType({description: 'User StateInfo Data'})
export class StateInfo {
	@ObjField({description: 'ID', isID: true})
	id!: string;
	@ObjField(() => State, {description: 'State'})
	state!: State;
}

@ResultType({description: 'User States Data'})
export class States {
	@ObjField(() => [StateInfo], {description: 'List of State Infos'})
	states!: Array<StateInfo>;
}
