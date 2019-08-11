import {ListResult} from '../engine/base/list-result';

export function paginate<T>(list: Array<T>, amount: number | undefined, offset: number | undefined): ListResult<T> {
	if (amount === undefined || amount < 0) {
		return {items: list, total: list.length, amount, offset};
	}
	offset = offset || 0;
	return {items: list.slice(offset, offset + amount), total: list.length, amount, offset};
}
