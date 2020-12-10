"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtworkTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
const enums_1 = require("../../types/enums");
let ArtworkTransformService = class ArtworkTransformService extends base_transform_1.BaseTransformService {
    async artworkBases(orm, list, artworkArgs, user) {
        return await Promise.all(list.map(t => this.artworkBase(orm, t, artworkArgs, user)));
    }
    async artworkBase(orm, o, artworkArgs, user) {
        return {
            id: o.id,
            name: o.name,
            types: o.types,
            height: o.height,
            width: o.width,
            format: o.format,
            created: o.createdAt.valueOf(),
            state: artworkArgs.artworkIncState ? await this.state(orm, o.id, enums_1.DBObjectType.artwork, user.id) : undefined,
            size: o.fileSize
        };
    }
};
ArtworkTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], ArtworkTransformService);
exports.ArtworkTransformService = ArtworkTransformService;
//# sourceMappingURL=artwork.transform.js.map