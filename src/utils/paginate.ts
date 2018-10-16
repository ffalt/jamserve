export function paginate<T>(list: Array<T>, amount: number | undefined, offset: number | undefined): Array<T> {
	if (amount !== undefined && amount < 0) {
		return list;
	}
	return list.slice((offset || 0), (offset || 0) + (amount || 20));
}
