"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneToMany = void 0;
const relation_register_1 = require("../helpers/relation-register");
function OneToMany(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, descriptor) => {
        const opt = (options || {});
        opt.relation = 'one2many';
        opt.mappedBy = mappedBy;
        relation_register_1.registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
exports.OneToMany = OneToMany;
//# sourceMappingURL=OneToMany.js.map