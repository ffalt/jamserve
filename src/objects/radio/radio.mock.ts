import {Radio} from './radio.model';
import {DBObjectType} from '../../types';

export function mockRadio(): Radio {
	return {
		id: '',
		type: DBObjectType.radio,
		name: 'a name',
		url: 'https://example.org/radioID1/stream',
		homepage: 'https://example.org/radioID1',
		disabled: false,
		created: Date.now(),
		updated: Date.now()
	};
}

export function mockRadio2(): Radio {
	return {
		id: '',
		type: DBObjectType.radio,
		name: 'second name',
		url: 'https://example.org/radioID2/stream',
		homepage: 'https://example.org/radioID2',
		disabled: true,
		created: Date.now(),
		updated: Date.now()
	};
}
