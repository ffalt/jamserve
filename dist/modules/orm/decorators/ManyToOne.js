"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManyToOne = void 0;
const relation_register_1 = require("../helpers/relation-register");
function ManyToOne(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, descriptor) => {
        const opt = (options || {});
        opt.relation = 'many2one';
        opt.mappedBy = mappedBy;
        relation_register_1.registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
exports.ManyToOne = ManyToOne;
//# sourceMappingURL=ManyToOne.js.map