var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import moment from 'moment';
import { SettingsService } from '../settings/settings.service.js';
import { Inject, InRequestScope } from 'typescript-ioc';
let ChatService = class ChatService {
    constructor() {
        this.messages = [];
        this.duration = moment.duration(0, 's');
        this.settingsService.registerChangeListener(async () => {
            this.updateSettings();
            await this.cleanOld();
        });
        this.updateSettings();
    }
    updateSettings() {
        this.duration = moment.duration(this.settingsService.settings.chat.maxAge.value, this.settingsService.settings.chat.maxAge.unit);
    }
    async cleanOld() {
        const d = moment().subtract(this.duration).valueOf();
        this.messages = this.messages.filter(c => d < c.created.valueOf());
    }
    async find(time) {
        return this.messages.find(message => message.created.valueOf() === time);
    }
    async remove(message) {
        this.messages = this.messages.filter(entry => entry.created.valueOf() !== message.created.valueOf());
    }
    async get(since) {
        await this.cleanOld();
        let list = this.messages;
        if (since !== undefined && !Number.isNaN(since)) {
            list = list.filter(message => message.created.valueOf() > since);
        }
        return list;
    }
    async add(message, user) {
        const c = {
            message,
            created: Date.now(),
            userName: user.name,
            userID: user.id
        };
        this.messages.push(c);
        if (this.messages.length > this.settingsService.settings.chat.maxMessages) {
            this.messages.shift();
        }
        return c;
    }
};
__decorate([
    Inject,
    __metadata("design:type", SettingsService)
], ChatService.prototype, "settingsService", void 0);
ChatService = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], ChatService);
export { ChatService };
//# sourceMappingURL=chat.service.js.map