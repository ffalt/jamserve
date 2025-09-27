var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { SubsonicOKResponse, SubsonicResponseInternetRadioStations } from '../model/subsonic-rest-data.js';
import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicParameterID, SubsonicParameterInternetRadioCreate, SubsonicParameterInternetRadioUpdate } from '../model/subsonic-rest-parameters.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
let SubsonicInternetRadioApi = class SubsonicInternetRadioApi {
    async getInternetRadioStations({ orm }) {
        const radios = await orm.Radio.findFilter({ disabled: false });
        const internetRadioStation = [];
        for (const radio of radios) {
            internetRadioStation.push(await SubsonicFormatter.packRadio(radio));
        }
        return { internetRadioStations: { internetRadioStation } };
    }
    async createInternetRadioStation(query, { orm, user }) {
        if (!user.roleAdmin) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
        }
        const radio = orm.Radio.create({ name: query.name, url: query.streamUrl, homepage: query.homepageUrl, disabled: false });
        await orm.Radio.persistAndFlush(radio);
        return {};
    }
    async updateInternetRadioStation(query, { orm, user }) {
        if (!user.roleAdmin) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
        }
        const radio = await orm.Radio.findOneOrFailByID(query.id);
        radio.name = query.name ?? radio.name;
        radio.url = query.streamUrl ?? radio.url;
        radio.homepage = query.homepageUrl ?? radio.homepage;
        await orm.Radio.persistAndFlush(radio);
        return {};
    }
    async deleteInternetRadioStation(query, { orm, user }) {
        if (!user.roleAdmin) {
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
        }
        const radio = await orm.Radio.findOneOrFailByID(query.id);
        await orm.Radio.removeAndFlush(radio);
        return {};
    }
};
__decorate([
    SubsonicRoute('/getInternetRadioStations', () => SubsonicResponseInternetRadioStations, {
        summary: 'Get Radios',
        description: 'Returns all internet radio stations.',
        tags: ['Radio']
    }),
    __param(0, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubsonicInternetRadioApi.prototype, "getInternetRadioStations", null);
__decorate([
    SubsonicRoute('/createInternetRadioStation', () => SubsonicOKResponse, {
        summary: 'Create Radios',
        description: 'Adds a new internet radio station. Only users with admin privileges are allowed to call this method.',
        tags: ['Radio']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterInternetRadioCreate, Object]),
    __metadata("design:returntype", Promise)
], SubsonicInternetRadioApi.prototype, "createInternetRadioStation", null);
__decorate([
    SubsonicRoute('/updateInternetRadioStation', () => SubsonicOKResponse, {
        summary: 'Update Radios',
        description: 'Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.',
        tags: ['Radio']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterInternetRadioUpdate, Object]),
    __metadata("design:returntype", Promise)
], SubsonicInternetRadioApi.prototype, "updateInternetRadioStation", null);
__decorate([
    SubsonicRoute('/deleteInternetRadioStation', () => SubsonicOKResponse, {
        summary: 'Delete Radios',
        description: 'Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.',
        tags: ['Radio']
    }),
    __param(0, SubsonicParameters()),
    __param(1, SubsonicContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterID, Object]),
    __metadata("design:returntype", Promise)
], SubsonicInternetRadioApi.prototype, "deleteInternetRadioStation", null);
SubsonicInternetRadioApi = __decorate([
    SubsonicController()
], SubsonicInternetRadioApi);
export { SubsonicInternetRadioApi };
//# sourceMappingURL=radio.js.map