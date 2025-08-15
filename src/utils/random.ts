import crypto from 'node:crypto';

export function shuffle<T>(list: Array<T>): Array<T> {
	for (let index = list.length - 1; index > 0; index--) {
		const pos = Math.floor(Math.random() * (index + 1));
		[list[index], list[pos]] = [list[pos], list[index]];
	}
	return list;
}

export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItems<T>(list: Array<T>, amount?: number): Array<T> {
	if (amount === undefined || amount < 0 || list.length <= amount) {
		return shuffle<T>(list);
	}
	const result: Array<T> = [];
	const done: Array<number> = [];
	while ((result.length < amount)) {
		const index = randomInt(0, list.length - 1);
		if (!done.includes(index)) {
			result.push(list[index]);
			done.push(index);
		}
	}
	return result;
}

export function randomString(length: number): string {
	return crypto.randomBytes(Math.ceil(length / 2))
		.toString('hex') /** convert to hexadecimal format */
		.slice(0, length); /** return required number of characters */
}
