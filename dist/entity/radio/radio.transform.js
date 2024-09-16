var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { BaseTransformService } from '../base/base.transform.js';
import { DBObjectType } from '../../types/enums.js';
let RadioTransformService = class RadioTransformService extends BaseTransformService {
    async radio(orm, o, radioArgs, user) {
        return {
            id: o.id,
            name: o.name,
            url: o.url,
            homepage: o.homepage,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf(),
            state: radioArgs.radioState ? await this.state(orm, o.id, DBObjectType.radio, user.id) : undefined
        };
    }
    async radioIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                url: item.url
            };
        });
    }
};
RadioTransformService = __decorate([
    InRequestScope
], RadioTransformService);
export { RadioTransformService };
//# sourceMappingURL=radio.transform.js.map