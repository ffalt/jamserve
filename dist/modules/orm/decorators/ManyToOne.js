import { registerRelation } from '../helpers/relation-register';
export function ManyToOne(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options || {});
        opt.relation = 'many2one';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
//# sourceMappingURL=ManyToOne.js.map