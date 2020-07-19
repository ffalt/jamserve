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
exports.ArtworkPageQL = exports.ArtworkQL = exports.Artwork = void 0;
const folder_1 = require("../folder/folder");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const mikro_orm_1 = require("mikro-orm");
const base_1 = require("../base/base");
const orm_types_1 = require("../../modules/engine/services/orm.types");
let Artwork = class Artwork extends base_1.Base {
    constructor() {
        super(...arguments);
        this.types = [];
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Artwork.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Artwork.prototype, "path", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.ArtworkImageType]),
    mikro_orm_1.Property({ type: orm_types_1.OrmStringListType }),
    __metadata("design:type", Array)
], Artwork.prototype, "types", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Artwork.prototype, "statCreated", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Artwork.prototype, "statModified", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Artwork.prototype, "fileSize", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Artwork.prototype, "width", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", Number)
], Artwork.prototype, "height", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    mikro_orm_1.Property(),
    __metadata("design:type", String)
], Artwork.prototype, "format", void 0);
__decorate([
    type_graphql_1.Field(() => folder_1.FolderQL),
    mikro_orm_1.ManyToOne(() => folder_1.Folder),
    __metadata("design:type", folder_1.Folder)
], Artwork.prototype, "folder", void 0);
Artwork = __decorate([
    type_graphql_1.ObjectType(),
    mikro_orm_1.Entity()
], Artwork);
exports.Artwork = Artwork;
let ArtworkQL = class ArtworkQL extends Artwork {
};
ArtworkQL = __decorate([
    type_graphql_1.ObjectType()
], ArtworkQL);
exports.ArtworkQL = ArtworkQL;
let ArtworkPageQL = class ArtworkPageQL extends base_1.PaginatedResponse(Artwork, ArtworkQL) {
};
ArtworkPageQL = __decorate([
    type_graphql_1.ObjectType()
], ArtworkPageQL);
exports.ArtworkPageQL = ArtworkPageQL;
//# sourceMappingURL=artwork.js.map