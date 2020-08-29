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
exports.StateQL = exports.State = void 0;
const user_1 = require("../user/user");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
let State = class State extends base_1.Base {
    constructor() {
        super(...arguments);
        this.user = new orm_1.Reference(this);
    }
};
__decorate([
    orm_1.Property(() => orm_1.ORM_ID),
    __metadata("design:type", String)
], State.prototype, "destID", void 0);
__decorate([
    orm_1.Property(() => enums_1.DBObjectType),
    __metadata("design:type", String)
], State.prototype, "destType", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Date)
], State.prototype, "faved", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Number)
], State.prototype, "played", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], State.prototype, "rated", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Date)
], State.prototype, "lastPlayed", void 0);
__decorate([
    orm_1.ManyToOne(() => user_1.User, user => user.states),
    __metadata("design:type", orm_1.Reference)
], State.prototype, "user", void 0);
State = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], State);
exports.State = State;
let StateQL = class StateQL extends State {
};
StateQL = __decorate([
    type_graphql_1.ObjectType()
], StateQL);
exports.StateQL = StateQL;
//# sourceMappingURL=state.js.map