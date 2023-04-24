import { getMetadataStorage } from '../metadata';
import { getTypeDecoratorParams } from '../helpers/decorators';
import { getParamInfo } from '../helpers/params';
import { extractPropertyName } from '../helpers/extract-property-name';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function QueryParams(paramTypeFnOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || typeof propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        getMetadataStorage().collectHandlerParamMetadata({
            kind: 'args',
            mode: 'query',
            propertyName: extractPropertyName(prototype, propertyKey, parameterIndex),
            ...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
//# sourceMappingURL=QueryParams.js.map