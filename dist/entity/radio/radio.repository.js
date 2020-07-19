"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const radio_1 = require("./radio");
const base_1 = require("../base/base");
let RadioRepository = class RadioRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.radio;
        this.indexProperty = 'name';
    }
    applyOrderByEntry(result, direction, order) {
        this.applyDefaultOrderByEntry(result, direction, order === null || order === void 0 ? void 0 : order.orderBy);
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { url: base_1.QHelper.eq(filter.url) },
            { homepage: base_1.QHelper.eq(filter.homepage) },
            { disabled: base_1.QHelper.eq(filter.disabled) },
            { createdAt: base_1.QHelper.gte(filter.since) }
        ]) : {};
    }
};
RadioRepository = __decorate([
    mikro_orm_1.Repository(radio_1.Radio)
], RadioRepository);
exports.RadioRepository = RadioRepository;
//# sourceMappingURL=radio.repository.js.map