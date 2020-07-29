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
exports.RadioResolver = void 0;
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const enums_1 = require("../../types/enums");
const radio_1 = require("./radio");
const radio_args_1 = require("./radio.args");
let RadioResolver = class RadioResolver {
    async radio(id, { orm }) {
        return await orm.Radio.oneOrFailByID(id);
    }
    async radios({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Radio.findListFilter(list, filter, order, page, user);
        }
        return await orm.Radio.searchFilter(filter, order, page, user);
    }
    async radioIndex({ filter }, { orm }) {
        return await orm.Radio.indexFilter(filter);
    }
    async state(radio, { orm, user }) {
        return await orm.State.findOrCreate(radio.id, enums_1.DBObjectType.radio, user.id);
    }
};
__decorate([
    type_graphql_1.Query(() => radio_1.RadioQL, { description: 'Get a Radio by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "radio", null);
__decorate([
    type_graphql_1.Query(() => radio_1.RadioPageQL, { description: 'Search Radios' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radio_args_1.RadiosArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "radios", null);
__decorate([
    type_graphql_1.Query(() => radio_1.RadioIndexQL, { description: 'Get the Navigation Index for Radios' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radio_args_1.RadioIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "radioIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radio_1.Radio, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "state", null);
RadioResolver = __decorate([
    type_graphql_1.Resolver(radio_1.RadioQL)
], RadioResolver);
exports.RadioResolver = RadioResolver;
//# sourceMappingURL=radio.resolver.js.map