import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function Ctx(propertyName) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        getMetadataStorage().collectHandlerParamMetadata({
            kind: 'context',
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            propertyName,
        });
    };
}
//# sourceMappingURL=Ctx.js.map