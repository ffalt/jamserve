import { registerRelation } from '../helpers/relation-register.js';
export function ManyToMany(returnTypeFunction, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options ?? {});
        opt.relation = 'many2many';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunction, opt);
    };
}
//# sourceMappingURL=many-to-many.js.map