"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
function paginate(list, page) {
    if (!page) {
        page = {};
    }
    if (page.take === undefined || page.take < 0) {
        return { items: list, total: list.length, ...page };
    }
    page.skip = page.skip || 0;
    return { items: list.slice(page.skip, page.skip + page.take), total: list.length, ...page };
}
exports.paginate = paginate;
//# sourceMappingURL=base.utils.js.map