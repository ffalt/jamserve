"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artWorkImageNameToType = void 0;
const enums_1 = require("../types/enums");
function artWorkImageNameToType(name) {
    const lname = name.toLowerCase();
    const types = [];
    for (const t in enums_1.ArtworkImageType) {
        if (!Number(t) && lname.includes(t)) {
            types.push(t);
        }
    }
    if ((!types.includes(enums_1.ArtworkImageType.front)) && (lname.includes('cover') || lname.includes('folder'))) {
        types.push(enums_1.ArtworkImageType.front);
    }
    if (types.length === 0) {
        types.push(enums_1.ArtworkImageType.other);
    }
    types.sort((a, b) => a.localeCompare(b));
    return types;
}
exports.artWorkImageNameToType = artWorkImageNameToType;
//# sourceMappingURL=artwork-type.js.map