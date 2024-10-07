import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { getParamInfo } from '../helpers/params.js';
import { extractPropertyName } from '../helpers/extract-property-name.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function BasePathParams(metadata, paramTypeFnOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        metadata.params.push({
            kind: 'args',
            mode: 'path',
            propertyName: extractPropertyName(prototype, propertyKey, parameterIndex),
            ...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
        });
    };
}
//# sourceMappingURL=PathParams.js.map