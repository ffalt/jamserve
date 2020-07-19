"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = void 0;
function slugify(s) {
    return s.replace(/[[\]. -]/g, '').toLowerCase();
}
exports.slugify = slugify;
//# sourceMappingURL=slug.js.map