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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const folder_service_1 = require("../folder/folder.service");
const enums_1 = require("../../types/enums");
let SeriesService = class SeriesService {
    async getImage(orm, series, size, format) {
        const folders = await series.folders.getItems();
        let p = folders[0];
        while (p) {
            if (p.folderType === enums_1.FolderType.artist) {
                break;
            }
            p = await p.parent.get();
        }
        if (p) {
            return this.folderService.getImage(orm, p, size, format);
        }
        for (const folder of folders) {
            const result = this.folderService.getImage(orm, folder, size, format);
            if (result) {
                return result;
            }
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_service_1.FolderService)
], SeriesService.prototype, "folderService", void 0);
SeriesService = __decorate([
    typescript_ioc_1.InRequestScope
], SeriesService);
exports.SeriesService = SeriesService;
//# sourceMappingURL=series.service.js.map