var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { DBObjectType } from '../../types/enums.js';
import { Op } from 'sequelize';
import { notFoundError } from '../../modules/deco/express/express-error.js';
let BookmarkService = class BookmarkService {
    async create(orm, destinationID, user, position, comment) {
        let bookmark = await orm.Bookmark.findOne({ where: { user: user.id, position: position, [Op.or]: [{ episode: destinationID }, { track: destinationID }] } });
        if (bookmark) {
            bookmark.comment = comment;
        }
        else {
            const result = await orm.findInStreamTypes(destinationID);
            if (!result) {
                return Promise.reject(notFoundError());
            }
            bookmark = orm.Bookmark.create({ position, comment });
            await bookmark.episode.set(result.objType === DBObjectType.episode ? result.obj : undefined);
            await bookmark.track.set(result.objType === DBObjectType.track ? result.obj : undefined);
            await bookmark.user.set(user);
        }
        await orm.Bookmark.persistAndFlush(bookmark);
        return bookmark;
    }
    async remove(orm, bookmarkID, userID) {
        await orm.Bookmark.removeByQueryAndFlush({ where: { id: bookmarkID, user: userID } });
    }
    async removeByDest(orm, destinationID, userID) {
        await orm.Bookmark.removeByQueryAndFlush({
            where: {
                user: userID,
                [Op.or]: [
                    { episode: destinationID },
                    { track: destinationID }
                ]
            }
        });
    }
};
BookmarkService = __decorate([
    InRequestScope
], BookmarkService);
export { BookmarkService };
//# sourceMappingURL=bookmark.service.js.map