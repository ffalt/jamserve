import { registerRelation } from '../helpers/relation-register.js';
export function OneToOne(returnTypeFunction, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options ?? {});
        opt.relation = 'one2one';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunction, opt);
    };
}
//# sourceMappingURL=one-to-one.js.map