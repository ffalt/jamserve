"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const rest_1 = require("../../modules/rest/");
const enums_1 = require("../../types/enums");
const orm_1 = require("../../modules/orm");
let BookmarkService = class BookmarkService {
    async create(orm, destID, user, position, comment) {
        let bookmark = await orm.Bookmark.findOne({ where: { user: user.id, position: position, [orm_1.Op.or]: [{ episode: { id: destID } }, { track: { id: destID } }] } });
        if (!bookmark) {
            const result = await orm.findInStreamTypes(destID);
            if (!result) {
                return Promise.reject(rest_1.NotFoundError());
            }
            bookmark = orm.Bookmark.create({ position, comment });
            await bookmark.episode.set(result.objType === enums_1.DBObjectType.episode ? result.obj : undefined);
            await bookmark.track.set(result.objType === enums_1.DBObjectType.track ? result.obj : undefined);
            await bookmark.user.set(user);
        }
        else {
            bookmark.comment = comment;
        }
        await orm.Bookmark.persistAndFlush(bookmark);
        return bookmark;
    }
    async remove(orm, id, userID) {
        await orm.Bookmark.removeByQueryAndFlush({ where: { id, user: userID } });
    }
    async removeByDest(orm, destID, userID) {
        await orm.Bookmark.removeByQueryAndFlush({
            where: {
                user: userID,
                [orm_1.Op.or]: [
                    { episode: destID },
                    { track: destID }
                ]
            }
        });
    }
};
BookmarkService = __decorate([
    typescript_ioc_1.InRequestScope
], BookmarkService);
exports.BookmarkService = BookmarkService;
//# sourceMappingURL=bookmark.service.js.map