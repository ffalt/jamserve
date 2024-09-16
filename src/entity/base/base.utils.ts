import {PageResult} from './base.js';
import {PageArgs} from './base.args.js';

export function paginate<T>(list: Array<T>, page: PageArgs | undefined): PageResult<T> {
	if (!page) {
		page = {};
	}
	if (page.take === undefined || page.take < 0) {
		return {items: list, total: list.length, ...page};
	}
	page.skip = page.skip || 0;
	return {items: list.slice(page.skip, page.skip + page.take), total: list.length, ...page};
}
