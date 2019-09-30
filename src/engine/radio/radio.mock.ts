import {DBObjectType} from '../../db/db.types';
import {Radio} from './radio.model';

export function mockRadio(): Radio {
	return {
		id: '',
		type: DBObjectType.radio,
		name: 'a name',
		url: 'https://example.org/radioID1/stream',
		homepage: 'https://example.org/radioID1',
		disabled: false,
		created: 1543495268,
		changed: 1543495269
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
		created: 1543495268,
		changed: 1543495269
	};
}

export function generateMockObjects(): Array<Radio> {
	return [mockRadio(), mockRadio2()];
}
