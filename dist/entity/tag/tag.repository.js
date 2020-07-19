"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const tag_1 = require("./tag");
const enums_1 = require("../../types/enums");
let TagRepository = class TagRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.tag;
    }
    applyOrderByEntry(result, direction, order) {
    }
    async buildFilter(filter, user) {
        return {};
    }
};
TagRepository = __decorate([
    mikro_orm_1.Repository(tag_1.Tag)
], TagRepository);
exports.TagRepository = TagRepository;
//# sourceMappingURL=tag.repository.js.map