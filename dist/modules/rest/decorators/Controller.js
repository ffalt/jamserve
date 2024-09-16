import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
function extractClassName(target) {
    const s = target.toString().split(' ');
    return s[1];
}
export function Controller(route, options) {
    return (target) => {
        getMetadataStorage().collectControllerClassMetadata({
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
//# sourceMappingURL=Controller.js.map