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
exports.SessionPageQL = exports.SessionQL = exports.Session = void 0;
const user_1 = require("../user/user");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
let Session = class Session extends base_1.Base {
    constructor() {
        super(...arguments);
        this.user = new orm_1.Reference(this);
    }
};
__decorate([
    orm_1.ManyToOne(() => user_1.User, user => user.sessions),
    __metadata("design:type", orm_1.Reference)
], Session.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "client", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "agent", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Date)
], Session.prototype, "expires", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.SessionMode),
    orm_1.Property(() => enums_1.SessionMode),
    __metadata("design:type", String)
], Session.prototype, "mode", void 0);
__decorate([
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "sessionID", void 0);
__decorate([
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Session.prototype, "cookie", void 0);
__decorate([
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "jwth", void 0);
Session = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Session);
exports.Session = Session;
let SessionQL = class SessionQL extends Session {
};
SessionQL = __decorate([
    type_graphql_1.ObjectType()
], SessionQL);
exports.SessionQL = SessionQL;
let SessionPageQL = class SessionPageQL extends base_1.PaginatedResponse(Session, SessionQL) {
};
SessionPageQL = __decorate([
    type_graphql_1.ObjectType()
], SessionPageQL);
exports.SessionPageQL = SessionPageQL;
//# sourceMappingURL=session.js.map