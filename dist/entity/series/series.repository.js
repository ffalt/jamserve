"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const series_1 = require("./series");
const base_1 = require("../base/base");
let SeriesRepository = class SeriesRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.series;
        this.indexProperty = 'name';
    }
    applyOrderByEntry(result, direction, order) {
        this.applyDefaultOrderByEntry(result, direction, order === null || order === void 0 ? void 0 : order.orderBy);
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { tracks: base_1.QHelper.foreignKeys(filter.trackIDs) },
            { albums: base_1.QHelper.foreignKeys(filter.albumIDs) },
            { artist: base_1.QHelper.foreignKey(filter.artistIDs) },
            { roots: base_1.QHelper.foreignKeys(filter.rootIDs) },
            { folders: base_1.QHelper.foreignKeys(filter.folderIDs) },
            ...base_1.QHelper.inStringArray('albumTypes', filter.albumTypes)
        ]) : {};
    }
};
SeriesRepository = __decorate([
    mikro_orm_1.Repository(series_1.Series)
], SeriesRepository);
exports.SeriesRepository = SeriesRepository;
//# sourceMappingURL=series.repository.js.map