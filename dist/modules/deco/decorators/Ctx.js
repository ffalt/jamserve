import { SymbolKeysNotSupportedError } from 'type-graphql';
export function BaseCtx(metadata, propertyName) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        metadata.params.push({
            kind: 'context',
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            propertyName
        });
    };
}
//# sourceMappingURL=Ctx.js.map