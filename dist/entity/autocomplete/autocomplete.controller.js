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
const enums_1 = require("../../types/enums");
const autocomplete_args_1 = require("./autocomplete.args");
let AutocompleteController = class AutocompleteController {
    async autocomplete(filter, { orm, user }) {
        const result = {};
        const { query } = filter;
        if (filter.track !== undefined && filter.track > 0) {
            const list = await orm.Track.findFilter({ query }, [], { take: filter.track }, user);
            result.tracks = [];
            for (const track of list) {
                const tag = await track.tag.get();
                result.tracks.push({ id: track.id, name: (tag === null || tag === void 0 ? void 0 : tag.title) || track.name || '' });
            }
        }
        if (filter.album !== undefined && filter.album > 0) {
            const list = await orm.Album.findFilter({ query }, [], { take: filter.album }, user);
            result.albums = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.artist !== undefined && filter.artist > 0) {
            const list = await orm.Artist.findFilter({ query }, [], { take: filter.artist }, user);
            result.artists = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.folder !== undefined && filter.folder > 0) {
            const list = await orm.Folder.findFilter({ query }, [], { take: filter.folder }, user);
            result.folders = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.playlist !== undefined && filter.playlist > 0) {
            const list = await orm.Playlist.findFilter({ query }, [], { take: filter.playlist }, user);
            result.playlists = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.podcast !== undefined && filter.podcast > 0) {
            const list = await orm.Podcast.findFilter({ query }, [], { take: filter.podcast }, user);
            result.podcasts = list.map(o => ({ id: o.id, name: o.title || '' }));
        }
        if (filter.episode !== undefined && filter.episode > 0) {
            const list = await orm.Episode.findFilter({ query }, [], { take: filter.episode }, user);
            result.episodes = list.map(o => ({ id: o.id, name: o.name }));
        }
        if (filter.series !== undefined && filter.series > 0) {
            const list = await orm.Series.findFilter({ query }, [], { take: filter.series }, user);
            result.series = list.map(o => ({ id: o.id, name: o.name }));
        }
        return result;
    }
};
__decorate([
    decorators_1.Get(() => autocomplete_model_1.AutoComplete, { description: 'Get compact Search Results for Autocomplete Features', summary: 'Get Autocomplete' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [autocomplete_args_1.AutoCompleteFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], AutocompleteController.prototype, "autocomplete", null);
AutocompleteController = __decorate([
    decorators_1.Controller('/autocomplete', { tags: ['Various'], roles: [enums_1.UserRole.stream] })
], AutocompleteController);
exports.AutocompleteController = AutocompleteController;
//# sourceMappingURL=autocomplete.controller.js.map