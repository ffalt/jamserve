import { getMetadataStorage } from '../metadata';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function CurrentUser() {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol') {
            throw new SymbolKeysNotSupportedError();
        }
        getMetadataStorage().collectHandlerParamMetadata({
            kind: 'context',
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            propertyName: 'user'
        });
    };
}
//# sourceMappingURL=CurrentUser.js.map