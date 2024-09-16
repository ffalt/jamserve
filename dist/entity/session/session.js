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
import { SessionMode } from '../../types/enums.js';
import { Field, ObjectType } from 'type-graphql';
import { Entity, ManyToOne, ORM_DATETIME, Property, Reference } from '../../modules/orm/index.js';
import { Base, PaginatedResponse } from '../base/base.js';
let Session = class Session extends Base {
    constructor() {
        super(...arguments);
        this.user = new Reference(this);
    }
};
__decorate([
    ManyToOne(() => User, user => user.sessions),
    __metadata("design:type", Reference)
], Session.prototype, "user", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "client", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "agent", void 0);
__decorate([
    Field(() => Date, { nullable: true }),
    Property(() => ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Date)
], Session.prototype, "expires", void 0);
__decorate([
    Field(() => SessionMode),
    Property(() => SessionMode),
    __metadata("design:type", String)
], Session.prototype, "mode", void 0);
__decorate([
    Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "sessionID", void 0);
__decorate([
    Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "cookie", void 0);
__decorate([
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "jwth", void 0);
Session = __decorate([
    ObjectType(),
    Entity()
], Session);
export { Session };
let SessionQL = class SessionQL extends Session {
};
SessionQL = __decorate([
    ObjectType()
], SessionQL);
export { SessionQL };
let SessionPageQL = class SessionPageQL extends PaginatedResponse(Session, SessionQL) {
};
SessionPageQL = __decorate([
    ObjectType()
], SessionPageQL);
export { SessionPageQL };
//# sourceMappingURL=session.js.map