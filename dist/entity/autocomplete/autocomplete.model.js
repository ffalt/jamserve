var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ResultType } from '../../modules/rest/decorators';
let AutoCompleteEntry = class AutoCompleteEntry {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], AutoCompleteEntry.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'Name', example: 'Awesome' }),
    __metadata("design:type", String)
], AutoCompleteEntry.prototype, "name", void 0);
AutoCompleteEntry = __decorate([
    ResultType({ description: 'AutoComplete Entry' })
], AutoCompleteEntry);
export { AutoCompleteEntry };
let AutoComplete = class AutoComplete {
};
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Tracks' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "tracks", void 0);
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Artists' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "artists", void 0);
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Albums' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "albums", void 0);
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Folder' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "folders", void 0);
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Playlist' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "playlists", void 0);
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Podcasts' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "podcasts", void 0);
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Episode' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "episodes", void 0);
__decorate([
    ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Series' }),
    __metadata("design:type", Array)
], AutoComplete.prototype, "series", void 0);
AutoComplete = __decorate([
    ResultType({ description: 'AutoComplete' })
], AutoComplete);
export { AutoComplete };
//# sourceMappingURL=autocomplete.model.js.map