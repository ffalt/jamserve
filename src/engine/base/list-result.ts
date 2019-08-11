export interface ListResult<T> {
	total?: number;
	offset?: number;
	amount?: number;
	items: Array<T>;
}
