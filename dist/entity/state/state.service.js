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
exports.StateService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const builder_1 = require("../../modules/rest/builder");
const state_helper_1 = require("./state.helper");
let StateService = class StateService {
    async findInStateTypes(id) {
        const repos = [
            this.orm.Album,
            this.orm.Artist,
            this.orm.Artwork,
            this.orm.Episode,
            this.orm.Folder,
            this.orm.Root,
            this.orm.Playlist,
            this.orm.Podcast,
            this.orm.Series,
            this.orm.Radio,
            this.orm.Track
        ];
        for (const repo of repos) {
            const obj = await repo.findOne({ id });
            if (obj) {
                return { obj: obj, objType: repo.objType };
            }
        }
    }
    async fav(id, remove, user) {
        const result = await this.findInStateTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        const helper = new state_helper_1.StateHelper(this.orm.orm.em);
        return await helper.fav(result.obj.id, result.objType, user, !!remove);
    }
    async rate(id, rating, user) {
        const result = await this.findInStateTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        const helper = new state_helper_1.StateHelper(this.orm.orm.em);
        return await helper.rate(result.obj.id, result.objType, user, rating);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], StateService.prototype, "orm", void 0);
StateService = __decorate([
    typescript_ioc_1.Singleton
], StateService);
exports.StateService = StateService;
//# sourceMappingURL=state.service.js.map