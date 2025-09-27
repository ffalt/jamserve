import { SymbolKeysNotSupportedError } from 'type-graphql';
export function BaseContext(metadata, propertyName) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        metadata.parameters.push({
            kind: 'context',
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            propertyName
        });
    };
}
//# sourceMappingURL=base-context.js.map