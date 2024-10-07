export function BaseObjParamsType(metadata) {
    return target => {
        metadata.argumentTypes.push({
            name: target.name,
            target,
            fields: []
        });
    };
}
//# sourceMappingURL=ObjParamsType.js.map