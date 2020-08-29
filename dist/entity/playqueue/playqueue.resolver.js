"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueResolver = void 0;
const type_graphql_1 = require("type-graphql");
const playqueue_1 = require("./playqueue");
const Root_1 = require("type-graphql/dist/decorators/Root");
const playqueue_entry_1 = require("../playqueueentry/playqueue-entry");
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
    type_graphql_1.Query(() => playqueue_1.PlayQueueQL, { description: 'Get a PlayQueue for the calling user' }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayQueueResolver.prototype, "playQueue", null);
__decorate([
    type_graphql_1.FieldResolver(() => [playqueue_entry_1.PlayQueueEntryQL]),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playqueue_1.PlayQueue]),
    __metadata("design:returntype", Promise)
], PlayQueueResolver.prototype, "entries", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, Root_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [playqueue_1.PlayQueue]),
    __metadata("design:returntype", Promise)
], PlayQueueResolver.prototype, "entriesCount", null);
PlayQueueResolver = __decorate([
    type_graphql_1.Resolver(playqueue_1.PlayQueueQL)
], PlayQueueResolver);
exports.PlayQueueResolver = PlayQueueResolver;
//# sourceMappingURL=playqueue.resolver.js.map