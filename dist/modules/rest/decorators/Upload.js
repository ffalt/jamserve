import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function Upload(name, returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        getMetadataStorage().collectHandlerParamMetadata({
            kind: 'arg',
            name,
            mode: 'file',
            propertyName: String(propertyKey),
            description: options.description,
            example: options.example,
            deprecationReason: options.deprecationReason,
            ...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
//# sourceMappingURL=Upload.js.map