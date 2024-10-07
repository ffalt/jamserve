import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { BaseObjParamsType } from '../../deco/decorators/ObjParamsType.js';
export function ObjParamsType() {
    return BaseObjParamsType(getMetadataStorage());
}
//# sourceMappingURL=ObjParamsType.js.map