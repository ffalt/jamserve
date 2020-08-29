"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneToOne = void 0;
const relation_register_1 = require("../helpers/relation-register");
function OneToOne(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options || {});
        opt.relation = 'one2one';
        opt.mappedBy = mappedBy;
        relation_register_1.registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
exports.OneToOne = OneToOne;
//# sourceMappingURL=OneToOne.js.map