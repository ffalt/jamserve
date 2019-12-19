import {Jam} from '../model/jam-rest-data';

export function defaultSettings(): Jam.AdminSettings {
	return {
		chat: {
			maxMessages: 100,
			maxAge: {value: 1, unit: 'day'}
		},
		index: {
			ignoreArticles: ['The', 'El', 'La', 'Los', 'Las', 'Le', 'Les', 'Die']
		},
		library: {
			scanAtStart: true
		},
		externalServices: {
			enabled: false
		}
	};
}
