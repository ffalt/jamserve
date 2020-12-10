"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkTransformService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const base_transform_1 = require("../base/base.transform");
let BookmarkTransformService = class BookmarkTransformService extends base_transform_1.BaseTransformService {
    async bookmarkBase(orm, o) {
        return {
            id: o.id,
            trackID: o.track.id(),
            episodeID: o.episode.id(),
            position: o.position,
            comment: o.comment,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf()
        };
    }
};
BookmarkTransformService = __decorate([
    typescript_ioc_1.InRequestScope
], BookmarkTransformService);
exports.BookmarkTransformService = BookmarkTransformService;
//# sourceMappingURL=bookmark.transform.js.map