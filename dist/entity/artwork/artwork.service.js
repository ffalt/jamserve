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
exports.ArtworkService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const io_service_1 = require("../../modules/engine/services/io.service");
const path_1 = __importDefault(require("path"));
const image_module_1 = require("../../modules/image/image.module");
let ArtworkService = class ArtworkService {
    async createByUrl(folder, url, types) {
        return this.ioService.downloadArtwork(folder.id, url, types, folder.root.idOrFail());
    }
    async createByFile(folder, filename, types) {
        return this.ioService.createArtwork(folder.id, filename, types, folder.root.idOrFail());
    }
    async upload(artwork, filename) {
        return this.ioService.replaceArtwork(artwork.id, filename, (await artwork.folder.getOrFail()).root.idOrFail());
    }
    async rename(artwork, newName) {
        return this.ioService.renameArtwork(artwork.id, newName, (await artwork.folder.getOrFail()).root.idOrFail());
    }
    async remove(artwork) {
        return this.ioService.deleteArtwork(artwork.id, (await artwork.folder.getOrFail()).root.idOrFail());
    }
    async getImage(orm, artwork, size, format) {
        return this.imageModule.get(artwork.id, path_1.default.join(artwork.path, artwork.name), size, format);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], ArtworkService.prototype, "ioService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], ArtworkService.prototype, "imageModule", void 0);
ArtworkService = __decorate([
    typescript_ioc_1.InRequestScope
], ArtworkService);
exports.ArtworkService = ArtworkService;
//# sourceMappingURL=artwork.service.js.map