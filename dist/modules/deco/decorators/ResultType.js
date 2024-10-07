import { getNameDecoratorParams } from '../helpers/decorators.js';
export function BaseResultType(metadata, nameOrOptions, maybeOptions) {
    const { name, options } = getNameDecoratorParams(nameOrOptions, maybeOptions);
    const interfaceClasses = options.implements && [].concat(options.implements);
    return target => {
        metadata.resultTypes.push({
            name: name || target.name,
            target,
            fields: [],
            description: options.description,
            interfaceClasses,
            isAbstract: options.isAbstract
        });
    };
}
//# sourceMappingURL=ResultType.js.map