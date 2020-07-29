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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderService = exports.getFolderDisplayArtwork = void 0;
const enums_1 = require("../../types/enums");
const path_1 = __importDefault(require("path"));
const typescript_ioc_1 = require("typescript-ioc");
const folder_rule_1 = require("../health/folder.rule");
const image_module_1 = require("../../modules/image/image.module");
async function getFolderDisplayArtwork(orm, folder) {
    const search = folder.folderType === enums_1.FolderType.artist ? enums_1.ArtworkImageType.artist : enums_1.ArtworkImageType.front;
    return (await folder.artworks.getItems()).find(a => a.types.includes(search));
}
exports.getFolderDisplayArtwork = getFolderDisplayArtwork;
let FolderService = class FolderService {
    constructor() {
        this.checker = new folder_rule_1.FolderRulesChecker();
    }
    async collectFolderPath(folder) {
        const result = [];
        const collect = async (f) => {
            if (!f) {
                return;
            }
            result.unshift(f);
            await collect(await f.parent.get());
        };
        await collect(folder);
        return result;
    }
    async getImage(orm, folder, size, format) {
        const artwork = await getFolderDisplayArtwork(orm, folder);
        if (artwork) {
            return this.imageModule.get(artwork.id, path_1.default.join(artwork.path, artwork.name), size, format);
        }
    }
    async health(orm, list) {
        const folders = list.sort((a, b) => a.path.localeCompare(b.path));
        const result = [];
        for (const folder of folders) {
            const parents = await this.collectFolderPath(await folder.parent.get());
            const health = await this.checker.run(orm, folder, parents);
            if (health && health.length > 0) {
                result.push({ folder, health });
            }
        }
        return result;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], FolderService.prototype, "imageModule", void 0);
FolderService = __decorate([
    typescript_ioc_1.InRequestScope
], FolderService);
exports.FolderService = FolderService;
//# sourceMappingURL=folder.service.js.map