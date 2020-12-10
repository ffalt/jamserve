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
exports.RadioController = void 0;
const radio_model_1 = require("./radio.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const radio_args_1 = require("./radio.args");
const base_args_1 = require("../base/base.args");
let RadioController = class RadioController {
    async id(id, radioArgs, { orm, engine, user }) {
        return engine.transform.Radio.radio(orm, await orm.Radio.oneOrFailByID(id), radioArgs, user);
    }
    async index(filter, { orm, engine }) {
        const result = await orm.Radio.indexFilter(filter);
        return engine.transform.Radio.radioIndex(orm, result);
    }
    async search(page, radioArgs, filter, order, { orm, engine, user }) {
        return await orm.Radio.searchTransformFilter(filter, [order], page, user, o => engine.transform.Radio.radio(orm, o, radioArgs, user));
    }
    async create(args, { orm, engine, user }) {
        const radio = orm.Radio.create(args);
        await orm.Radio.persistAndFlush(radio);
        return await engine.transform.Radio.radio(orm, radio, {}, user);
    }
    async update(id, args, { orm, engine, user }) {
        const radio = await orm.Radio.oneOrFailByID(id);
        radio.disabled = !!args.disabled;
        radio.homepage = args.homepage;
        radio.name = args.name;
        radio.url = args.url;
        await orm.Radio.persistAndFlush(radio);
        return await engine.transform.Radio.radio(orm, radio, {}, user);
    }
    async remove(id, { orm }) {
        const radio = await orm.Radio.oneOrFailByID(id);
        await orm.Radio.removeAndFlush(radio);
    }
};
__decorate([
    rest_1.Get('/id', () => radio_model_1.Radio, { description: 'Get a Radio by Id', summary: 'Get Radio' }),
    __param(0, rest_1.QueryParam('id', { description: 'Radio Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, radio_args_1.IncludesRadioArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => radio_model_1.RadioIndex, { description: 'Get the Navigation Index for Radios', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radio_args_1.RadioFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => radio_model_1.RadioPage, { description: 'Search Radios' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        radio_args_1.IncludesRadioArgs,
        radio_args_1.RadioFilterArgs,
        radio_args_1.RadioOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioController.prototype, "search", null);
__decorate([
    rest_1.Post('/create', { description: 'Create a Radio', roles: [enums_1.UserRole.admin], summary: 'Create Radio' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [radio_args_1.RadioMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioController.prototype, "create", null);
__decorate([
    rest_1.Post('/update', { description: 'Update a Radio', roles: [enums_1.UserRole.admin], summary: 'Update Radio' }),
    __param(0, rest_1.BodyParam('id', { description: 'Root Id', isID: true })),
    __param(1, rest_1.BodyParams()),
    __param(2, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, radio_args_1.RadioMutateArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioController.prototype, "update", null);
__decorate([
    rest_1.Post('/remove', { description: 'Remove a Radio', roles: [enums_1.UserRole.admin], summary: 'Remove Radio' }),
    __param(0, rest_1.BodyParam('id', { description: 'Root Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RadioController.prototype, "remove", null);
RadioController = __decorate([
    rest_1.Controller('/radio', { tags: ['Radio'], roles: [enums_1.UserRole.stream] })
], RadioController);
exports.RadioController = RadioController;
//# sourceMappingURL=radio.controller.js.map