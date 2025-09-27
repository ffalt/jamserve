import { registerRelation } from '../helpers/relation-register.js';
export function ManyToOne(returnTypeFunction, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options ?? {});
        opt.relation = 'many2one';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunction, opt);
    };
}
//# sourceMappingURL=many-to-one.js.map