"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const state_1 = require("./state");
let StateRepository = class StateRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.state;
    }
    applyOrderByEntry(result, direction, order) {
    }
    async buildFilter(filter, user) {
        return {};
    }
    async findOrCreate(destID, type, userID) {
        const state = await this.findOne({
            $and: [
                { user: { id: userID } },
                { destID: { $eq: destID } },
                { destType: { $eq: type } }
            ]
        });
        return state || new state_1.State();
    }
    async findMany(destIDs, type, userID) {
        return await this.find({
            $and: [
                { user: { id: userID } },
                { destID: { $in: destIDs } },
                { destType: { $eq: type } }
            ]
        });
    }
};
StateRepository = __decorate([
    mikro_orm_1.Repository(state_1.State)
], StateRepository);
exports.StateRepository = StateRepository;
//# sourceMappingURL=state.repository.js.map