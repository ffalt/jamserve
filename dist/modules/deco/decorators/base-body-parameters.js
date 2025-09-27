import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
import { getParameterInfo } from '../helpers/parameters.js';
export function BaseBodyParameters(metadata, parameterTypeFunctionOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = getTypeDecoratorParameters(parameterTypeFunctionOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        metadata.parameters.push({
            kind: 'args',
            mode: 'body',
            propertyName: propertyKey,
            ...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
        });
    };
}
//# sourceMappingURL=base-body-parameters.js.map