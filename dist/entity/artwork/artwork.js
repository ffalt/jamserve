var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Folder, FolderQL } from '../folder/folder.js';
import { ArtworkImageType } from '../../types/enums.js';
import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, ManyToOne, ORM_DATETIME, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base, PaginatedResponse } from '../base/base.js';
let Artwork = class Artwork extends Base {
    constructor() {
        super(...arguments);
        this.types = [];
        this.folder = new Reference(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Artwork.prototype, "name", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Artwork.prototype, "path", void 0);
__decorate([
    Field(() => [ArtworkImageType]),
    Property(() => [ArtworkImageType]),
    __metadata("design:type", Array)
], Artwork.prototype, "types", void 0);
__decorate([
    Field(() => Date),
    Property(() => ORM_DATETIME),
    __metadata("design:type", Date)
], Artwork.prototype, "statCreated", void 0);
__decorate([
    Field(() => Date),
    Property(() => ORM_DATETIME),
    __metadata("design:type", Date)
], Artwork.prototype, "statModified", void 0);
__decorate([
    Field(() => Int),
    Property(() => ORM_INT),
    __metadata("design:type", Number)
], Artwork.prototype, "fileSize", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Artwork.prototype, "width", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Artwork.prototype, "height", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Artwork.prototype, "format", void 0);
__decorate([
    Field(() => FolderQL),
    ManyToOne(() => Folder, folder => folder.artworks),
    __metadata("design:type", Reference)
], Artwork.prototype, "folder", void 0);
Artwork = __decorate([
    ObjectType(),
    Entity()
], Artwork);
export { Artwork };
let ArtworkQL = class ArtworkQL extends Artwork {
};
ArtworkQL = __decorate([
    ObjectType()
], ArtworkQL);
export { ArtworkQL };
let ArtworkPageQL = class ArtworkPageQL extends PaginatedResponse(Artwork, ArtworkQL) {
};
ArtworkPageQL = __decorate([
    ObjectType()
], ArtworkPageQL);
export { ArtworkPageQL };
//# sourceMappingURL=artwork.js.map