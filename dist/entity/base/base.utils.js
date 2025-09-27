export function paginate(list, page = {}) {
    const total = list.length;
    const take = page.take;
    if (take === undefined || take < 0) {
        return { items: list, total, ...page };
    }
    const skip = page.skip ?? 0;
    return { items: list.slice(skip, skip + take), total, ...page, skip };
}
//# sourceMappingURL=base.utils.js.map