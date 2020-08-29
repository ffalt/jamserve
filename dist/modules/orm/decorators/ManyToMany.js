"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManyToMany = void 0;
const relation_register_1 = require("../helpers/relation-register");
function ManyToMany(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options || {});
        opt.relation = 'many2many';
        opt.mappedBy = mappedBy;
        relation_register_1.registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
exports.ManyToMany = ManyToMany;
//# sourceMappingURL=ManyToMany.js.map