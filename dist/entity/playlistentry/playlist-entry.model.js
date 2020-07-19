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
exports.PlaylistEntryPage = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const tag_model_1 = require("../tag/tag.model");
const base_model_1 = require("../base/base.model");
let PlaylistEntryPage = class PlaylistEntryPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => tag_model_1.MediaBase, { description: 'List of Playlist Entries' }),
    __metadata("design:type", Array)
], PlaylistEntryPage.prototype, "items", void 0);
PlaylistEntryPage = __decorate([
    decorators_1.ResultType({ description: 'Playlist Entry Page' })
], PlaylistEntryPage);
exports.PlaylistEntryPage = PlaylistEntryPage;
//# sourceMappingURL=playlist-entry.model.js.map