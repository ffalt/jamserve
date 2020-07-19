"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodeRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const episode_1 = require("./episode");
let EpisodeRepository = class EpisodeRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.episode;
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.EpisodeOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.EpisodeOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.EpisodeOrderFields.status:
                result.status = direction;
                break;
            case enums_1.EpisodeOrderFields.name:
                result.name = direction;
                break;
            case enums_1.EpisodeOrderFields.default:
            case enums_1.EpisodeOrderFields.date:
                result.date = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { status: base_1.QHelper.inOrEqual(filter.statuses) },
            { guid: base_1.QHelper.inOrEqual(filter.guids) },
            { author: base_1.QHelper.inOrEqual(filter.authors) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { podcast: base_1.QHelper.foreignKey(filter.podcastIDs) }
        ]) : {};
    }
};
EpisodeRepository = __decorate([
    mikro_orm_1.Repository(episode_1.Episode)
], EpisodeRepository);
exports.EpisodeRepository = EpisodeRepository;
//# sourceMappingURL=episode.repository.js.map