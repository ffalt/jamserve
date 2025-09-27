import { getNameDecoratorParameters } from '../helpers/decorators.js';
export function BaseResultType(metadata, nameOrOptions, maybeOptions) {
    const { name, options } = getNameDecoratorParameters(nameOrOptions, maybeOptions);
    const interfaceClasses = options.implements && [].concat(options.implements);
    return target => {
        metadata.resultTypes.push({
            name: name ?? target.name,
            target,
            fields: [],
            description: options.description,
            interfaceClasses,
            isAbstract: options.isAbstract
        });
    };
}
//# sourceMappingURL=base-result-type.js.map