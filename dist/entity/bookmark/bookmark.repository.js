"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const bookmark_1 = require("./bookmark");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
let BookmarkRepository = class BookmarkRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.bookmark;
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.BookmarkOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.BookmarkOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.BookmarkOrderFields.default:
            case enums_1.BookmarkOrderFields.position:
                result.position = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { comment: base_1.QHelper.like(filter.query) },
            { comment: base_1.QHelper.eq(filter.comment) },
            { track: base_1.QHelper.foreignKey(filter.trackIDs) },
            { episode: base_1.QHelper.foreignKey(filter.episodeIDs) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { user: user === null || user === void 0 ? void 0 : user.id }
        ]) : { user: user === null || user === void 0 ? void 0 : user.id };
    }
};
BookmarkRepository = __decorate([
    mikro_orm_1.Repository(bookmark_1.Bookmark)
], BookmarkRepository);
exports.BookmarkRepository = BookmarkRepository;
//# sourceMappingURL=bookmark.repository.js.map