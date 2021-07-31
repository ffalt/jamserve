var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform';
let PlayQueueTransformService = class PlayQueueTransformService extends BaseTransformService {
    async playQueueBase(orm, o, playQueueArgs, user) {
        const u = o.user.id() === user.id ? user : await o.user.getOrFail();
        return {
            changed: o.updatedAt.valueOf(),
            changedBy: o.changedBy,
            created: o.createdAt.valueOf(),
            currentIndex: o.current,
            mediaPosition: o.position,
            userID: u.id,
            userName: u.name,
            entriesCount: await o.entries.count(),
            entriesIDs: playQueueArgs.playQueueEntriesIDs ? (await o.entries.getItems()).map(t => (t.track.id()) || (t.episode.id())) : undefined
        };
    }
};
PlayQueueTransformService = __decorate([
    InRequestScope
], PlayQueueTransformService);
export { PlayQueueTransformService };
//# sourceMappingURL=playqueue.transform.js.map