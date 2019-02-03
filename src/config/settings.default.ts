import {Jam} from '../model/jam-rest-data';

export const defaultSettings: Jam.AdminSettings = {
	chat: {
		maxMessages: 100,
		maxAge: {value: 1, unit: 'day'}
	},
	index: {
		ignoreArticles: ['The', 'El', 'La', 'Los', 'Las', 'Le', 'Les', 'Die']
	},
	library: {
		scanAtStart: true,
		audioBookGenreNames: ['audiobook', 'audio book', 'audiobooks', 'audio books', 'hörspiel', 'hörspiele', 'hörbuch', 'hörbucher']
	}
};
