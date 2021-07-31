import { registerRelation } from '../helpers/relation-register';
export function OneToOne(returnTypeFunc, mappedBy, options) {
    return (prototype, propertyKey, _) => {
        const opt = (options || {});
        opt.relation = 'one2one';
        opt.mappedBy = mappedBy;
        registerRelation(prototype, propertyKey, returnTypeFunc, opt);
    };
}
//# sourceMappingURL=OneToOne.js.map