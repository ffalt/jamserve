import { registerRelation } from '../helpers/relation-register.js';
export function OneToMany(returnTypeFunction, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options ?? {});
        opt.relation = 'one2many';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunction, opt);
    };
}
//# sourceMappingURL=one-to-many.js.map