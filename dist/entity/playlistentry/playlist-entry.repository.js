"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistEntryRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const playlist_entry_1 = require("./playlist-entry");
let PlaylistEntryRepository = class PlaylistEntryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.playlistentry;
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.PlaylistEntryOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.PlaylistEntryOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.PlaylistEntryOrderFields.default:
            case enums_1.PlaylistEntryOrderFields.position:
                result.position = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        return {};
    }
};
PlaylistEntryRepository = __decorate([
    mikro_orm_1.Repository(playlist_entry_1.PlaylistEntry)
], PlaylistEntryRepository);
exports.PlaylistEntryRepository = PlaylistEntryRepository;
//# sourceMappingURL=playlist-entry.repository.js.map