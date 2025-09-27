import { State } from './state.js';
import { Op } from 'sequelize';
export class StateHelper {
    constructor(em) {
        this.em = em;
        this.stateRepo = this.em.getRepository(State);
    }
    async emptyState(destinationID, destinationType, user) {
        const state = this.stateRepo.create({
            destID: destinationID,
            destType: destinationType,
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
    async fav(destinationID, destinationType, user, remove) {
        const state = await this.findOrCreate(destinationID, destinationType, user);
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
    async rate(destinationID, destinationType, user, rating) {
        const state = await this.findOrCreate(destinationID, destinationType, user);
        state.rated = (rating === 0) ? undefined : rating;
        await this.stateRepo.persistAndFlush(state);
        return state;
    }
    async findOrCreate(destinationID, destinationType, user) {
        const state = await this.stateRepo.findOne({ where: { user: user.id, destID: destinationID, destType: destinationType } });
        return state ?? (await this.emptyState(destinationID, destinationType, user));
    }
    async getHighestRatedDestIDs(destinationType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType: destinationType, rated: { [Op.gte]: 1 } },
            order: [['rated', 'DESC']]
        });
        return states.map(a => a.destID);
    }
    async getAvgHighestDestIDs(destinationType) {
        const states = await this.stateRepo.find({ where: { destType: destinationType, rated: { [Op.gte]: 1 } } });
        const ratings = {};
        for (const state of states) {
            if (state.rated !== undefined) {
                ratings[state.destID] = ratings[state.destID] ?? [];
                ratings[state.destID].push(state.rated);
            }
        }
        const list = Object.keys(ratings).map(key => {
            return {
                id: key,
                avg: ratings[key].reduce((b, c) => (b + c), 0) / ratings[key].length
            };
        }).sort((a, b) => (b.avg - a.avg));
        return list.map(a => a.id);
    }
    async getFrequentlyPlayedDestIDs(destinationType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType: destinationType, played: { [Op.gte]: 1 } },
            order: [
                ['played', 'DESC'],
                ['lastPlayed', 'DESC']
            ]
        });
        return states.map(a => a.destID);
    }
    async getFavedDestIDs(destinationType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType: destinationType, faved: { [Op.ne]: null } },
            order: [['faved', 'DESC']]
        });
        return states.map(a => a.destID);
    }
    async getRecentlyPlayedDestIDs(destinationType, userID) {
        const states = await this.stateRepo.find({
            where: { user: userID, destType: destinationType, played: { [Op.gte]: 1 } },
            order: [['lastPlayed', 'DESC']]
        });
        return states.map(a => a.destID);
    }
    async reportPlaying(destinationID, destinationType, user) {
        const state = await this.findOrCreate(destinationID, destinationType, user);
        state.played = (state.played ?? 0) + 1;
        state.lastPlayed = new Date();
        await this.stateRepo.persistAndFlush(state);
        return state;
    }
}
//# sourceMappingURL=state.helper.js.map