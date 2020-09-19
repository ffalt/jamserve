"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateHelper = void 0;
const state_1 = require("./state");
const orm_1 = require("../../modules/orm");
class StateHelper {
    constructor(em) {
        this.em = em;
        this.stateRepo = this.em.getRepository(state_1.State);
    }
    async emptyState(destID, destType, user) {
        const state = this.stateRepo.create({
            destID,
            destType,
            played: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastPlayed: undefined,
            faved: undefined,
            rated: 0
        });
        await state.user.set(user);
        return state;
    }
    async fav(destID, destType, user, remove) {
        const state = await this.findOrCreate(destID, destType, user);
        if (remove) {
            if (state.faved === undefined) {
                return state;
            }
            state.faved = null;
        }
        else {
            if (state.faved !== undefined) {
                return state;
            }
            state.faved = new Date();
        }
        await this.stateRepo.persistAndFlush(state);
        if (state.faved === null) {
            state.faved = undefined;
        }
        return state;
    }
    async rate(destID, destType, user, rating) {
        const state = await this.findOrCreate(destID, destType, user);
        state.rated = (rating === 0) ? undefined : rating;
        await this.stateRepo.persistAndFlush(state);
        return state;
    }
    async findOrCreate(destID, destType, user) {
        const state = await this.stateRepo.findOne({ where: { user: user.id, destID, destType } });
        return state || await this.emptyState(destID, destType, user);
    }
    async getHighestRatedDestIDs(destType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType, rated: { [orm_1.Op.gte]: 1 } },
            order: [['rated', 'DESC']]
        });
        return states.map(a => a.destID);
    }
    async getAvgHighestDestIDs(destType) {
        const states = await this.stateRepo.find({ where: { destType, rated: { [orm_1.Op.gte]: 1 } } });
        const ratings = {};
        states.forEach(state => {
            if (state.rated !== undefined) {
                ratings[state.destID] = ratings[state.destID] || [];
                ratings[state.destID].push(state.rated);
            }
        });
        const list = Object.keys(ratings).map(key => {
            return {
                id: key,
                avg: ratings[key].reduce((b, c) => (b + c), 0) / ratings[key].length
            };
        }).sort((a, b) => (b.avg - a.avg));
        return list.map(a => a.id);
    }
    async getFrequentlyPlayedDestIDs(destType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType, played: { [orm_1.Op.gte]: 1 } },
            order: [
                ['played', 'DESC'],
                ['lastPlayed', 'DESC']
            ]
        });
        return states.map(a => a.destID);
    }
    async getFavedDestIDs(destType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType, faved: { [orm_1.Op.ne]: null } },
            order: [['faved', 'DESC']]
        });
        return states.map(a => a.destID);
    }
    async getRecentlyPlayedDestIDs(destType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType, played: { [orm_1.Op.gte]: 1 } },
            order: [['lastPlayed', 'DESC']]
        });
        return states.map(a => a.destID);
    }
    async reportPlaying(destID, destType, user) {
        const state = await this.findOrCreate(destID, destType, user);
        state.played = (state.played || 0) + 1;
        state.lastPlayed = new Date();
        await this.stateRepo.persistAndFlush(state);
        return state;
    }
}
exports.StateHelper = StateHelper;
//# sourceMappingURL=state.helper.js.map