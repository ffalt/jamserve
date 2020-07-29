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
exports.RadioIndexQL = exports.RadioIndexGroupQL = exports.RadioPageQL = exports.RadioQL = exports.Radio = void 0;
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
const state_1 = require("../state/state");
let Radio = class Radio extends base_1.Base {
    constructor() {
        super(...arguments);
        this.disabled = false;
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Radio.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Radio.prototype, "url", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Radio.prototype, "homepage", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    orm_1.Property(() => Boolean),
    __metadata("design:type", Boolean)
], Radio.prototype, "disabled", void 0);
Radio = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Radio);
exports.Radio = Radio;
let RadioQL = class RadioQL extends Radio {
};
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], RadioQL.prototype, "state", void 0);
RadioQL = __decorate([
    type_graphql_1.ObjectType()
], RadioQL);
exports.RadioQL = RadioQL;
let RadioPageQL = class RadioPageQL extends base_1.PaginatedResponse(Radio, RadioQL) {
};
RadioPageQL = __decorate([
    type_graphql_1.ObjectType()
], RadioPageQL);
exports.RadioPageQL = RadioPageQL;
let RadioIndexGroupQL = class RadioIndexGroupQL extends base_1.IndexGroup(Radio, RadioQL) {
};
RadioIndexGroupQL = __decorate([
    type_graphql_1.ObjectType()
], RadioIndexGroupQL);
exports.RadioIndexGroupQL = RadioIndexGroupQL;
let RadioIndexQL = class RadioIndexQL extends base_1.Index(RadioIndexGroupQL) {
};
RadioIndexQL = __decorate([
    type_graphql_1.ObjectType()
], RadioIndexQL);
exports.RadioIndexQL = RadioIndexQL;
//# sourceMappingURL=radio.js.map