import { getTypeDecoratorParameters } from '../helpers/decorators.js';
import { getParameterInfo } from '../helpers/parameters.js';
import { SymbolKeysNotSupportedError } from 'type-graphql';
export function BaseQueryParameter(metadata, name, returnTypeFunctionOrOptions, maybeOptions) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === 'symbol' || propertyKey === undefined) {
            throw new SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = getTypeDecoratorParameters(returnTypeFunctionOrOptions, maybeOptions);
        metadata.parameters.push({
            kind: 'arg',
            name,
            mode: 'query',
            propertyName: propertyKey,
            isID: options.isID,
            description: options.description,
            example: options.example,
            deprecationReason: options.deprecationReason,
            ...getParameterInfo({ prototype, propertyKey: propertyKey, parameterIndex, returnTypeFunc, options })
        });
    };
}
//# sourceMappingURL=base-query-parameter.js.map