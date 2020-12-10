"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
let RadioTransformService = class RadioTransformService extends base_transform_1.BaseTransformService {
    async radio(orm, o, radioArgs, user) {
        return {
            id: o.id,
            name: o.name,
            url: o.url,
            homepage: o.homepage,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf(),
            state: radioArgs.radioState ? await this.state(orm, o.id, enums_1.DBObjectType.radio, user.id) : undefined
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
    typescript_ioc_1.InRequestScope
], RadioTransformService);
exports.RadioTransformService = RadioTransformService;
//# sourceMappingURL=radio.transform.js.map