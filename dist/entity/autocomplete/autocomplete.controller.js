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
exports.AutocompleteController = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const autocomplete_model_1 = require("./autocomplete.model");
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const user_1 = require("../user/user");
const enums_1 = require("../../types/enums");
const autocomplete_args_1 = require("./autocomplete.args");
let AutocompleteController = class AutocompleteController {
    async autocomplete(filter, user) {
        const result = {};
        const { query } = filter;
        if (filter.track !== undefined && filter.track > 0) {
            const list = await this.orm.Track.findFilter({ query }, { limit: filter.track }, user);
            await this.orm.Track.populate(list, 'tag');
            result.tracks = list.map(o => { var _a; return ({ id: o.id, name: ((_a = o.tag) === null || _a === void 0 ? void 0 : _a.title) || o.name || '' }); });
        }
        if (filter.album !== undefined && filter.album > 0) {
            const list = await this.orm.Album.findFilter({ query }, { limit: filter.album }, user);
            result.albums = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.artist !== undefined && filter.artist > 0) {
            const list = await this.orm.Artist.findFilter({ query }, { limit: filter.artist }, user);
            result.artists = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.folder !== undefined && filter.folder > 0) {
            const list = await this.orm.Folder.findFilter({ query }, { limit: filter.folder }, user);
            result.folders = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.playlist !== undefined && filter.playlist > 0) {
            const list = await this.orm.Playlist.findFilter({ query }, { limit: filter.playlist }, user);
            result.playlists = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.podcast !== undefined && filter.podcast > 0) {
            const list = await this.orm.Podcast.findFilter({ query }, { limit: filter.podcast }, user);
            result.podcasts = list.map(o => ({ id: o.id, name: o.title || '' }));
        }
        if (filter.episode !== undefined && filter.episode > 0) {
            const list = await this.orm.Episode.findFilter({ query }, { limit: filter.episode }, user);
            result.episodes = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.series !== undefined && filter.series > 0) {
            const list = await this.orm.Series.findFilter({ query }, { limit: filter.series }, user);
            result.series = list.map(o => ({ id: o.id, name: o.name }));
        }
        return result;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], AutocompleteController.prototype, "orm", void 0);
__decorate([
    decorators_1.Get(() => autocomplete_model_1.AutoComplete, { description: 'Get compact Search Results for Autocomplete Features', summary: 'Get Autocomplete' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [autocomplete_args_1.AutoCompleteFilterArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], AutocompleteController.prototype, "autocomplete", null);
AutocompleteController = __decorate([
    decorators_1.Controller('/autocomplete', { tags: ['Various'], roles: [enums_1.UserRole.stream] })
], AutocompleteController);
exports.AutocompleteController = AutocompleteController;
//# sourceMappingURL=autocomplete.controller.js.map