"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const builder_1 = require("../../modules/rest/builder");
const state_helper_1 = require("./state.helper");
let StateService = class StateService {
    async fav(orm, id, remove, user) {
        const result = await orm.findInStateTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        const helper = new state_helper_1.StateHelper(orm.em);
        return await helper.fav(result.obj.id, result.objType, user, !!remove);
    }
    async rate(orm, id, rating, user) {
        const result = await orm.findInStateTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        const helper = new state_helper_1.StateHelper(orm.em);
        return await helper.rate(result.obj.id, result.objType, user, rating);
    }
};
StateService = __decorate([
    typescript_ioc_1.InRequestScope
], StateService);
exports.StateService = StateService;
//# sourceMappingURL=state.service.js.map