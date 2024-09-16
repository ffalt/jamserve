var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { DBObjectType } from '../../types/enums.js';
let ArtworkTransformService = class ArtworkTransformService extends BaseTransformService {
    async artworkBases(orm, list, artworkArgs, user) {
        return await Promise.all(list.map(t => this.artworkBase(orm, t, artworkArgs, user)));
    }
    async artworkBase(orm, o, artworkArgs, user) {
        return {
            id: o.id,
            name: o.name,
            types: o.types,
            height: o.height,
            width: o.width,
            format: o.format,
            created: o.createdAt.valueOf(),
            state: artworkArgs.artworkIncState ? await this.state(orm, o.id, DBObjectType.artwork, user.id) : undefined,
            size: o.fileSize
        };
    }
};
ArtworkTransformService = __decorate([
    InRequestScope
], ArtworkTransformService);
export { ArtworkTransformService };
//# sourceMappingURL=artwork.transform.js.map