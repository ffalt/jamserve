import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
export function ObjParamsType() {
    return target => {
        getMetadataStorage().collectArgsMetadata({
            name: target.name,
            target,
            fields: []
        });
    };
}
//# sourceMappingURL=ObjParamsType.js.map