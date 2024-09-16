var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { User } from '../user/user.js';
import { PlayQueueEntry, PlayQueueEntryQL } from '../playqueueentry/playqueue-entry.js';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, OneToMany, OneToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';
import { PlayQueueEntryOrderFields } from '../../types/enums.js';
let PlayQueue = class PlayQueue extends Base {
    constructor() {
        super(...arguments);
        this.user = new Reference(this);
        this.entries = new Collection(this);
    }
};
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], PlayQueue.prototype, "current", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], PlayQueue.prototype, "position", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], PlayQueue.prototype, "duration", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], PlayQueue.prototype, "changedBy", void 0);
__decorate([
    OneToOne(() => User, user => user.playQueue, { owner: true }),
    __metadata("design:type", Object)
], PlayQueue.prototype, "user", void 0);
__decorate([
    Field(() => [PlayQueueEntryQL]),
    OneToMany(() => PlayQueueEntry, entry => entry.playQueue, { order: [{ orderBy: PlayQueueEntryOrderFields.position }] }),
    __metadata("design:type", Collection)
], PlayQueue.prototype, "entries", void 0);
PlayQueue = __decorate([
    ObjectType(),
    Entity()
], PlayQueue);
export { PlayQueue };
let PlayQueueQL = class PlayQueueQL extends PlayQueue {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], PlayQueueQL.prototype, "entriesCount", void 0);
PlayQueueQL = __decorate([
    ObjectType()
], PlayQueueQL);
export { PlayQueueQL };
//# sourceMappingURL=playqueue.js.map