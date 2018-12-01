// TODO make these settings changeable via api

export const AppConfig = {
	chat: {
		maxMsgs: 100,
		maxAge: {value: 1, unit: 'day'}
	},
	index: {
		ignore: ['The', 'El', 'La', 'Los', 'Las', 'Le', 'Les', 'Die']
	}
};
