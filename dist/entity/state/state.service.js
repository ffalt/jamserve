var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { NotFoundError } from '../../modules/rest/index.js';
import { StateHelper } from './state.helper.js';
let StateService = class StateService {
    async fav(orm, id, remove, user) {
        const result = await orm.findInStateTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        const helper = new StateHelper(orm.em);
        return await helper.fav(result.obj.id, result.objType, user, !!remove);
    }
    async rate(orm, id, rating, user) {
        const result = await orm.findInStateTypes(id);
        if (!result) {
            return Promise.reject(NotFoundError());
        }
        const helper = new StateHelper(orm.em);
        return await helper.rate(result.obj.id, result.objType, user, rating);
    }
    async reportPlaying(orm, entries, user) {
        const helper = new StateHelper(orm.em);
        for (const entry of entries) {
            if (entry.id) {
                await helper.reportPlaying(entry.id, entry.type, user);
            }
        }
    }
};
StateService = __decorate([
    InRequestScope
], StateService);
export { StateService };
//# sourceMappingURL=state.service.js.map