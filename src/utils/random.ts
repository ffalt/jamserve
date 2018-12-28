import crypto from 'crypto';

export function shuffle<T>(list: Array<T>): Array<T> {
	for (let i = list.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[list[i], list[j]] = [list[j], list[i]];
	}
	return list;
}

export function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(list: Array<T>): T {
	const i = randomInt(0, list.length - 1);
	return list[i];
}

export function randomItems<T>(list: Array<T>, amount?: number): Array<T> {
	if (amount === undefined || amount < 0 || list.length <= amount) {
		return shuffle<T>(list);
	}
	const result: Array<T> = [];
	const done: Array<number> = [];
	while ((result.length < amount)) {
		const i = randomInt(0, list.length - 1);
		if (done.indexOf(i) < 0) {
			result.push(list[i]);
			done.push(i);
		}
	}
	return result;
}

export function randomString(length: number): string {
	return crypto.randomBytes(Math.ceil(length / 2))
		.toString('hex') /** convert to hexadecimal format */
		.slice(0, length);   /** return required number of characters */
}
