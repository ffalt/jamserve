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
import { UserRole } from '../../types/enums.js';
import { State, States } from './state.model.js';
import { FavParameters, RateParameters, StatesParameters } from './state.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
const description = '[Album, Artist, Artwork, Episode, Folder, Root, Playlist, Podcast, Radio, Series, Track]';
let StateController = class StateController {
    async state(id, { orm, engine, user }) {
        const result = await orm.findInStateTypes(id);
        if (!result) {
            return Promise.reject(notFoundError());
        }
        return engine.transform.Base.state(orm, id, result.objType, user.id);
    }
    async states(parameters, { orm, engine, user }) {
        const states = { states: [] };
        for (const id of parameters.ids) {
            const result = await orm.findInStateTypes(id);
            if (result) {
                states.states.push({ id, state: await engine.transform.Base.state(orm, id, result.objType, user.id) });
            }
        }
        return states;
    }
    async fav(parameters, { orm, engine, user }) {
        return await engine.transform.Base.stateBase(orm, await engine.state.fav(orm, parameters.id, parameters.remove, user));
    }
    async rate(parameters, { orm, engine, user }) {
        return await engine.transform.Base.stateBase(orm, await engine.state.rate(orm, parameters.id, parameters.rating, user));
    }
};
__decorate([
    Get('/id', () => State, { description: `Get User State (fav/rate/etc) ${description}`, summary: 'Get State' }),
    __param(0, QueryParameter('id', { description: 'Object Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "state", null);
__decorate([
    Get('/list', () => States, { description: `Get User States (fav/rate/etc) ${description}`, summary: 'Get States' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StatesParameters, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "states", null);
__decorate([
    Post('/fav', () => State, { description: `Set/Unset Favorite ${description}`, summary: 'Fav' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FavParameters, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "fav", null);
__decorate([
    Post('/rate', () => State, { description: `Rate ${description}`, summary: 'Rate' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RateParameters, Object]),
    __metadata("design:returntype", Promise)
], StateController.prototype, "rate", null);
StateController = __decorate([
    Controller('/state', { tags: ['State'], roles: [UserRole.stream] })
], StateController);
export { StateController };
//# sourceMappingURL=state.controller.js.map