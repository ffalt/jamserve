"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const session_1 = require("./session");
const base_1 = require("../base/base");
let SessionRepository = class SessionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.session;
    }
    applyOrderByEntry(result, direction, order) {
        this.applyDefaultOrderByEntry(result, direction, order === null || order === void 0 ? void 0 : order.orderBy);
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { client: base_1.QHelper.eq(filter.client) },
            { agent: base_1.QHelper.eq(filter.agent) },
            { mode: base_1.QHelper.eq(filter.mode) },
            { expires: base_1.QHelper.lte(filter.expiresTo) },
            { expires: base_1.QHelper.gte(filter.expiresFrom) },
            { user: user === null || user === void 0 ? void 0 : user.id }
        ]) : {};
    }
};
SessionRepository = __decorate([
    mikro_orm_1.Repository(session_1.Session)
], SessionRepository);
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=session.repository.js.map