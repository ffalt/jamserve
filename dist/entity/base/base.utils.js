export function paginate(list, page) {
    if (!page) {
        page = {};
    }
    if (page.take === undefined || page.take < 0) {
        return { items: list, total: list.length, ...page };
    }
    page.skip = page.skip || 0;
    return { items: list.slice(page.skip, page.skip + page.take), total: list.length, ...page };
}
//# sourceMappingURL=base.utils.js.map