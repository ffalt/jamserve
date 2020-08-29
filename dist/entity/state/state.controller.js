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
exports.StateController = void 0;
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const state_model_1 = require("./state.model");
const state_args_1 = require("./state.args");
const description = '[Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track]';
let StateController = class StateController {
    async state(id, { orm, engine, user }) {
        const result = await orm.findInStateTypes(id);
        if (!result) {
            return Promise.reject(rest_1.NotFoundError());
        }
        return engine.transform.state(orm, id, result.objType, user.id);
    }
    async states(args, { orm, engine, user }) {
        const states = { states: [] };
        for (const id of args.ids) {
            const result = await orm.findInStateTypes(id);
            if (result) {
                states.states.push({ id, state: await engine.transform.state(orm, id, result.objType, user.id) });
            }
        }
        return states;
    }
    async fav(args, { orm, engine, user }) {
        return await engine.transform.stateBase(orm, await engine.state.fav(orm, args.id, args.remove, user));
    }
    async rate(args, { orm, engine, user }) {
        return await engine.transform.stateBase(orm, await engine.state.rate(orm, args.id, args.rating, user));
    }
};
__decorate([
    rest_1.Get('/id', () => state_model_1.State, { description: `Get User State (fav/rate/etc) ${description}`, summary: 'Get State' }),
    __param(0, rest_1.QueryParam('id', { description: 'Object Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "state", null);
__decorate([
    rest_1.Get('/list', () => state_model_1.States, { description: `Get User States (fav/rate/etc) ${description}`, summary: 'Get States' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [state_args_1.StatesArgs, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "states", null);
__decorate([
    rest_1.Post('/fav', () => state_model_1.State, { description: `Set/Unset Favorite ${description}`, summary: 'Fav' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [state_args_1.FavArgs, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "fav", null);
__decorate([
    rest_1.Post('/rate', () => state_model_1.State, { description: `Rate ${description}`, summary: 'Rate' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [state_args_1.RateArgs, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "rate", null);
StateController = __decorate([
    rest_1.Controller('/state', { tags: ['State'], roles: [enums_1.UserRole.stream] })
], StateController);
exports.StateController = StateController;
//# sourceMappingURL=state.controller.js.map