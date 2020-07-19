"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const playqueue_1 = require("./playqueue");
let PlayQueueRepository = class PlayQueueRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.playqueue;
    }
    applyOrderByEntry(result, direction, order) {
    }
    async buildFilter(filter, user) {
        return {};
    }
};
PlayQueueRepository = __decorate([
    mikro_orm_1.Repository(playqueue_1.PlayQueue)
], PlayQueueRepository);
exports.PlayQueueRepository = PlayQueueRepository;
//# sourceMappingURL=playqueue.repository.js.map