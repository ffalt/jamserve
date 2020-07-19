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
exports.BookmarkService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const express_error_1 = require("../../modules/rest/builder/express-error");
const enums_1 = require("../../types/enums");
let BookmarkService = class BookmarkService {
    async create(destID, user, position, comment) {
        let bookmark = await this.orm.Bookmark.oneOrFail({
            user: user.id,
            position: { $eq: position },
            $or: [
                { episode: destID },
                { track: destID }
            ]
        });
        if (!bookmark) {
            const result = await this.orm.findInStreamTypes(destID);
            if (!result) {
                return Promise.reject(express_error_1.NotFoundError());
            }
            bookmark = this.orm.Bookmark.create({
                track: result.objType === enums_1.DBObjectType.track ? result.obj : undefined,
                episode: result.objType === enums_1.DBObjectType.episode ? result.obj : undefined,
                user,
                position,
                comment
            });
        }
        else {
            bookmark.comment = comment;
        }
        await this.orm.orm.em.persistAndFlush(bookmark);
        return bookmark;
    }
    async remove(id, userID) {
        await this.orm.Bookmark.remove({ id, user: { id: userID } }, true);
    }
    async removeByDest(destID, userID) {
        await this.orm.Bookmark.remove({
            user: { id: userID },
            $or: [
                { episode: destID },
                { track: destID }
            ]
        }, true);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], BookmarkService.prototype, "orm", void 0);
BookmarkService = __decorate([
    typescript_ioc_1.Singleton
], BookmarkService);
exports.BookmarkService = BookmarkService;
//# sourceMappingURL=bookmark.service.js.map