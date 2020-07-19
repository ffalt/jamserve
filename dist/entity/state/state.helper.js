"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateHelper = void 0;
const state_1 = require("./state");
class StateHelper {
    constructor(em) {
        this.em = em;
        this.stateRepo = this.em.getRepository(state_1.State);
    }
    emptyState(destID, destType, user) {
        return this.stateRepo.create({
            destID,
            destType,
            played: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastPlayed: undefined,
            faved: undefined,
            rated: 0,
            user
        });
    }
    async fav(destID, destType, user, remove) {
        const state = await this.findOrCreate(destID, destType, user);
        if (remove) {
            if (state.faved === undefined) {
                return state;
            }
            state.faved = undefined;
        }
        else {
            if (state.faved !== undefined) {
                return state;
            }
            state.faved = Date.now();
        }
        await this.stateRepo.persistAndFlush(state);
        return state;
    }
    async rate(destID, destType, user, rating) {
        const state = await this.findOrCreate(destID, destType, user);
        state.rated = (rating === 0) ? undefined : rating;
        await this.stateRepo.persistAndFlush(state);
        return state;
    }
    async findOrCreate(destID, destType, user) {
        const state = await this.stateRepo.findOne({ user: user.id, destID: { $eq: destID }, destType: { $eq: destType } });
        return state || this.emptyState(destID, destType, user);
    }
    async getHighestRatedDestIDs(destType, userID) {
        const states = await this.stateRepo.find({ user: { id: userID }, destType: { $eq: destType }, rated: { $gte: 1 } });
        const ratings = states.sort((a, b) => Number(b.rated) - Number(a.rated));
        return ratings.map(a => a.destID);
    }
    async getAvgHighestDestIDs(destType) {
        const states = await this.stateRepo.find({ destType: { $eq: destType } });
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
        const states = await this.stateRepo.find({ user: { id: userID }, destType: { $eq: destType }, played: { $gte: 1 } });
        return states.sort((a, b) => Number(b.played) - Number(a.played)).map(a => a.destID);
    }
    async getFavedDestIDs(destType, userID) {
        const states = await this.stateRepo.find({ user: { id: userID }, destType: { $eq: destType }, faved: { $gte: 1 } });
        return states.sort((a, b) => Number(b.faved) - Number(a.faved)).map(a => a.destID);
    }
    async getRecentlyPlayedDestIDs(destType, userID) {
        const states = await this.stateRepo.find({ user: { id: userID }, destType: { $eq: destType }, played: { $gte: 1 } });
        return states.sort((a, b) => Number(b.lastPlayed) - Number(a.lastPlayed)).map(a => a.destID);
    }
    async reportPlaying(destID, destType, user) {
        const state = await this.findOrCreate(destID, destType, user);
        state.played = (state.played || 0) + 1;
        state.lastPlayed = Date.now();
        await this.stateRepo.persistAndFlush(state);
        return state;
    }
}
exports.StateHelper = StateHelper;
//# sourceMappingURL=state.helper.js.map