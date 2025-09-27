export function BaseObjectParametersType(metadata) {
    return target => {
        metadata.parameterTypes.push({
            name: target.name,
            target,
            fields: []
        });
    };
}
//# sourceMappingURL=base-object-parameters-type.js.map