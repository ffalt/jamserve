import { registerRelation } from '../helpers/relation-register.js';
export function ManyToMany(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options || {});
        opt.relation = 'many2many';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
//# sourceMappingURL=ManyToMany.js.map