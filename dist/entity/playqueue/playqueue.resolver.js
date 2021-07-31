var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Ctx, FieldResolver, Int, Query, Resolver } from 'type-graphql';
import { PlayQueue, PlayQueueQL } from './playqueue';
import { Root as GQLRoot } from 'type-graphql/dist/decorators/Root';
import { PlayQueueEntryQL } from '../playqueueentry/playqueue-entry';
let PlayQueueResolver = class PlayQueueResolver {
    async playQueue({ engine, orm, user }) {
        return engine.playQueue.get(orm, user);
    }
    async entries(playQueue) {
        return playQueue.entries.getItems();
    }
    async entriesCount(playQueue) {
        return playQueue.entries.count();
    }
};
__decorate([
    Query(() => PlayQueueQL, { description: 'Get a PlayQueue for the calling user' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayQueueResolver.prototype, "playQueue", null);
__decorate([
    FieldResolver(() => [PlayQueueEntryQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayQueue]),
    __metadata("design:returntype", Promise)
], PlayQueueResolver.prototype, "entries", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlayQueue]),
    __metadata("design:returntype", Promise)
], PlayQueueResolver.prototype, "entriesCount", null);
PlayQueueResolver = __decorate([
    Resolver(PlayQueueQL)
], PlayQueueResolver);
export { PlayQueueResolver };
//# sourceMappingURL=playqueue.resolver.js.map