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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueQL = exports.PlayQueue = void 0;
const user_1 = require("../user/user");
const playqueue_entry_1 = require("../playqueueentry/playqueue-entry");
const type_graphql_1 = require("type-graphql");
const mikro_orm_1 = require("mikro-orm");
const base_1 = require("../base/base");
let PlayQueue = class PlayQueue extends base_1.Base {
    constructor() {
        super(...arguments);
        this.entries = new mikro_orm_1.Collection(this);
    }
};
__decorate([
    mikro_orm_1.OneToOne(() => user_1.User),
    __metadata("design:type", user_1.User)
], PlayQueue.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], PlayQueue.prototype, "current", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], PlayQueue.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], PlayQueue.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], PlayQueue.prototype, "changedBy", void 0);
__decorate([
    type_graphql_1.Field(() => [playqueue_entry_1.PlayQueueEntryQL]),
    mikro_orm_1.OneToMany(() => playqueue_entry_1.PlayQueueEntry, entry => entry.playQueue, { orderBy: { position: mikro_orm_1.QueryOrder.ASC } }),
    __metadata("design:type", mikro_orm_1.Collection)
], PlayQueue.prototype, "entries", void 0);
PlayQueue = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], PlayQueue);
exports.PlayQueue = PlayQueue;
let PlayQueueQL = class PlayQueueQL extends PlayQueue {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], PlayQueueQL.prototype, "entriesCount", void 0);
PlayQueueQL = __decorate([
    type_graphql_1.ObjectType()
], PlayQueueQL);
exports.PlayQueueQL = PlayQueueQL;
//# sourceMappingURL=playqueue.js.map