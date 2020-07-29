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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const series_1 = require("./series");
const series_args_1 = require("./series.args");
let SeriesResolver = class SeriesResolver {
    async series(id, { orm }) {
        return await orm.Series.oneOrFailByID(id);
    }
    async serieses({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Series.findListFilter(list, filter, order, page, user);
        }
        return await orm.Series.searchFilter(filter, order, page, user);
    }
    async seriesIndex({ filter }, { orm, user }) {
        return await orm.Series.indexFilter(filter, user);
    }
    async rootsCount(series, { orm }) {
        return series.roots.count();
    }
    async foldersCount(series, { orm }) {
        return series.folders.count();
    }
    async tracksCount(series, { orm }) {
        return series.tracks.count();
    }
    async albumsCount(series, { orm }) {
        return series.albums.count();
    }
    async state(series, { orm, user }) {
        return await orm.State.findOrCreate(series.id, enums_1.DBObjectType.series, user.id);
    }
};
__decorate([
    type_graphql_1.Query(() => series_1.SeriesQL, { description: 'Get a Series by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "series", null);
__decorate([
    type_graphql_1.Query(() => series_1.SeriesPageQL, { description: 'Search Series' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_args_1.SeriesArgsQL, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "serieses", null);
__decorate([
    type_graphql_1.Query(() => series_1.SeriesIndexQL, { description: 'Get the Navigation Index for Series' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_args_1.SeriesIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "seriesIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_1.Series, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "rootsCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_1.Series, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "foldersCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_1.Series, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "tracksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_1.Series, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "albumsCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [series_1.Series, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "state", null);
SeriesResolver = __decorate([
    type_graphql_1.Resolver(series_1.SeriesQL)
], SeriesResolver);
exports.SeriesResolver = SeriesResolver;
//# sourceMappingURL=series.resolver.js.map