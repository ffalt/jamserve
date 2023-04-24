import { getMetadataStorage } from '../metadata';
import { getTypeDecoratorParams } from '../helpers/decorators';
import { getParamInfo } from '../helpers/params';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function BodyParam(name, returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || typeof propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        getMetadataStorage().collectHandlerParamMetadata({
            kind: 'arg',
            name,
            mode: 'body',
            propertyName: String(propertyKey),
            description: options.description,
            example: options.example,
            deprecationReason: options.deprecationReason,
            ...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
//# sourceMappingURL=BodyParam.js.map