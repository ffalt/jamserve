import {Jam} from '../../model/jam-rest-data-0.1.0';
import {State, States} from './state.model';

export function formatState(state?: State): Jam.State {
	return {
		played: state && state.played > 0 ? state.played : undefined,
		lastplayed: state && state.lastplayed > 0 ? state.lastplayed : undefined,
		faved: state ? state.faved : undefined,
		rated: state && state.rated !== undefined && state.rated > 0 ? state.rated : undefined
	};
}

export function formatStates(states: States): Jam.States {
	const result: Jam.States = {};
	Object.keys(states).forEach(key => {
		result[key] = formatState(states[key]);
	});
	return result;
}
