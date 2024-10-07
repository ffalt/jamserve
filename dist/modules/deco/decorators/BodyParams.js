import { getTypeDecoratorParams } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { getParamInfo } from '../helpers/params.js';
export function BaseBodyParams(metadata, paramTypeFnOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        metadata.params.push({
            kind: 'args',
            mode: 'body',
            propertyName: String(propertyKey),
            ...getParamInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
        });
    };
}
//# sourceMappingURL=BodyParams.js.map