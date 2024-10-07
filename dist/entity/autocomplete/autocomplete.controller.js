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
import { AutoComplete } from './autocomplete.model.js';
import { UserRole } from '../../types/enums.js';
import { AutoCompleteFilterArgs } from './autocomplete.args.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
let AutocompleteController = class AutocompleteController {
    async autocomplete(filter, { orm, user }) {
        const result = {};
        const { query } = filter;
        if (filter.track !== undefined && filter.track > 0) {
            const list = await orm.Track.findFilter({ query }, [], { take: filter.track }, user);
            result.tracks = [];
            for (const track of list) {
                const tag = await track.tag.get();
                result.tracks.push({ id: track.id, name: tag?.title || track.name || '' });
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
    Get(() => AutoComplete, { description: 'Get compact Search Results for Autocomplete Features', summary: 'Get Autocomplete' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AutoCompleteFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], AutocompleteController.prototype, "autocomplete", null);
AutocompleteController = __decorate([
    Controller('/autocomplete', { tags: ['Various'], roles: [UserRole.stream] })
], AutocompleteController);
export { AutocompleteController };
//# sourceMappingURL=autocomplete.controller.js.map