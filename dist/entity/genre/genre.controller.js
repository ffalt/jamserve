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
exports.GenreController = void 0;
const genre_service_1 = require("./genre.service");
const typescript_ioc_1 = require("typescript-ioc");
const genre_model_1 = require("./genre.model");
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
const base_utils_1 = require("../base/base.utils");
const genre_args_1 = require("./genre.args");
let GenreController = class GenreController {
    async list(page, filter, { orm }) {
        const genres = await this.genreService.getGenres(orm, filter.rootID);
        return base_utils_1.paginate(genres, page);
    }
    async index({ orm }) {
        return await this.genreService.index(orm);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_service_1.GenreService)
], GenreController.prototype, "genreService", void 0);
__decorate([
    decorators_1.Get('/list', () => genre_model_1.GenrePage, { description: 'Get a list of genres found in the library', summary: 'Get Genres' }),
    __param(0, decorators_1.QueryParams()),
    __param(1, decorators_1.QueryParams()),
    __param(2, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        genre_args_1.GenreFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "list", null);
__decorate([
    decorators_1.Get('/index', () => genre_model_1.GenreIndex, { description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index' }),
    __param(0, decorators_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GenreController.prototype, "index", null);
GenreController = __decorate([
    typescript_ioc_1.InRequestScope,
    decorators_1.Controller('/genre', { tags: ['Genres'], roles: [enums_1.UserRole.stream] })
], GenreController);
exports.GenreController = GenreController;
//# sourceMappingURL=genre.controller.js.map