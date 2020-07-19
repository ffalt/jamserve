"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const podcast_1 = require("./podcast");
const base_1 = require("../base/base");
let PodcastRepository = class PodcastRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.podcast;
        this.indexProperty = 'name';
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.PodcastOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.PodcastOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.PodcastOrderFields.lastCheck:
                result.lastCheck = direction;
                break;
            case enums_1.PodcastOrderFields.default:
            case enums_1.PodcastOrderFields.name:
                result.name = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { description: base_1.QHelper.eq(filter.description) },
            { url: base_1.QHelper.eq(filter.url) },
            { author: base_1.QHelper.eq(filter.author) },
            { title: base_1.QHelper.eq(filter.title) },
            { generator: base_1.QHelper.eq(filter.generator) },
            { status: base_1.QHelper.inOrEqual(filter.statuses) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { episodes: base_1.QHelper.foreignKeys(filter.episodeIDs) },
            { lastCheck: base_1.QHelper.lte(filter.lastCheckTo) },
            { lastCheck: base_1.QHelper.gte(filter.lastCheckFrom) },
            ...base_1.QHelper.inStringArray('categories', filter.categories)
        ]) : {};
    }
};
PodcastRepository = __decorate([
    mikro_orm_1.Repository(podcast_1.Podcast)
], PodcastRepository);
exports.PodcastRepository = PodcastRepository;
//# sourceMappingURL=podcast.repository.js.map