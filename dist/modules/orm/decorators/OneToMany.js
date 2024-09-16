import { registerRelation } from '../helpers/relation-register.js';
export function OneToMany(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options || {});
        opt.relation = 'one2many';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
//# sourceMappingURL=OneToMany.js.map