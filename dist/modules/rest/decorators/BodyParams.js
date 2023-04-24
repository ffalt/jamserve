import { getMetadataStorage } from '../metadata';
import { getTypeDecoratorParams } from '../helpers/decorators';
import { getParamInfo } from '../helpers/params';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function BodyParams(paramTypeFnOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || typeof propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        getMetadataStorage().collectHandlerParamMetadata({
            kind: 'args',
            mode: 'body',
            propertyName: String(propertyKey),
            ...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
//# sourceMappingURL=BodyParams.js.map