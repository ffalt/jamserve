function extractClassName(target) {
    const s = target.toString().split(' ');
    return s.at(1) ?? '';
}
export function BaseController(metadata, route, options) {
    return (target) => {
        metadata.controllerClasses.push({
            target,
            route,
            name: extractClassName(target),
            description: options?.description,
            roles: options?.roles,
            tags: options?.tags,
            abstract: options?.abstract,
            deprecationReason: options?.deprecationReason
        });
    };
}
//# sourceMappingURL=base-controller.js.map