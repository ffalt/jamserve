import { PageResult } from './base.js';
import { PageParameters } from './base.parameters.js';

export function paginate<T>(list: Array<T>, page: PageParameters = {}): PageResult<T> {
	const total = list.length;
	const take = page.take;
	if (take === undefined || take < 0) {
		return { items: list, total, ...page };
	}
	const skip = page.skip ?? 0;
	return { items: list.slice(skip, skip + take), total, ...page, skip };
}
