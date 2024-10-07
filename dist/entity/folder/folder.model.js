var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Page } from '../base/base.model.js';
import { TrackBase } from '../track/track.model.js';
import { Artwork } from '../artwork/artwork.model.js';
import { FolderHealthHint } from '../health/health.model.js';
import { FolderBase } from './folder-base.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let Folder = class Folder extends FolderBase {
};
__decorate([
    ObjField(() => [TrackBase], { nullable: true, description: 'List of Tracks' }),
    __metadata("design:type", Array)
], Folder.prototype, "tracks", void 0);
__decorate([
    ObjField(() => [FolderBase], { nullable: true, description: 'List of Folders' }),
    __metadata("design:type", Array)
], Folder.prototype, "folders", void 0);
__decorate([
    ObjField(() => [Artwork], { nullable: true, description: 'List of Artwork Images' }),
    __metadata("design:type", Array)
], Folder.prototype, "artworks", void 0);
__decorate([
    ObjField(() => [FolderBase], { nullable: true, description: 'List of similar Folders (via Exteernal Service)' }),
    __metadata("design:type", Array)
], Folder.prototype, "similar", void 0);
Folder = __decorate([
    ResultType({ description: 'Folder with tracks' })
], Folder);
export { Folder };
let FolderPage = class FolderPage extends Page {
};
__decorate([
    ObjField(() => [Folder], { description: 'List of Folders' }),
    __metadata("design:type", Array)
], FolderPage.prototype, "items", void 0);
FolderPage = __decorate([
    ResultType({ description: 'Folder Page' })
], FolderPage);
export { FolderPage };
let FolderIndexEntry = class FolderIndexEntry {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], FolderIndexEntry.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Name', example: 'The Mars Volta' }),
    __metadata("design:type", String)
], FolderIndexEntry.prototype, "name", void 0);
__decorate([
    ObjField({ description: 'Track Count', min: 0, example: 5 }),
    __metadata("design:type", Number)
], FolderIndexEntry.prototype, "trackCount", void 0);
FolderIndexEntry = __decorate([
    ResultType({ description: 'Folder Index Entry' })
], FolderIndexEntry);
export { FolderIndexEntry };
let FolderIndexGroup = class FolderIndexGroup {
};
__decorate([
    ObjField({ description: 'Folder Group Name', example: 'M' }),
    __metadata("design:type", String)
], FolderIndexGroup.prototype, "name", void 0);
__decorate([
    ObjField(() => [FolderIndexEntry]),
    __metadata("design:type", Array)
], FolderIndexGroup.prototype, "items", void 0);
FolderIndexGroup = __decorate([
    ResultType({ description: 'Folder Index Group' })
], FolderIndexGroup);
export { FolderIndexGroup };
let FolderIndex = class FolderIndex {
};
__decorate([
    ObjField({ description: 'Last Change Timestamp' }),
    __metadata("design:type", Number)
], FolderIndex.prototype, "lastModified", void 0);
__decorate([
    ObjField(() => [FolderIndexGroup], { description: 'Folder Index Groups' }),
    __metadata("design:type", Array)
], FolderIndex.prototype, "groups", void 0);
FolderIndex = __decorate([
    ResultType({ description: 'Folder Index' })
], FolderIndex);
export { FolderIndex };
let FolderHealth = class FolderHealth {
};
__decorate([
    ObjField(() => Folder, { description: 'Folder' }),
    __metadata("design:type", Folder)
], FolderHealth.prototype, "folder", void 0);
__decorate([
    ObjField(() => [FolderHealthHint], { description: 'List of Health Hints' }),
    __metadata("design:type", Array)
], FolderHealth.prototype, "health", void 0);
FolderHealth = __decorate([
    ResultType({ description: 'Folder Health' })
], FolderHealth);
export { FolderHealth };
//# sourceMappingURL=folder.model.js.map