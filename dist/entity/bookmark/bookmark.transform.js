var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform';
let BookmarkTransformService = class BookmarkTransformService extends BaseTransformService {
    async bookmarkBase(orm, o) {
        return {
            id: o.id,
            trackID: o.track.id(),
            episodeID: o.episode.id(),
            position: o.position,
            comment: o.comment,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf()
        };
    }
};
BookmarkTransformService = __decorate([
    InRequestScope
], BookmarkTransformService);
export { BookmarkTransformService };
//# sourceMappingURL=bookmark.transform.js.map