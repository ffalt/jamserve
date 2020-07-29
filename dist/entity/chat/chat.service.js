"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const moment_1 = __importDefault(require("moment"));
const settings_service_1 = require("../settings/settings.service");
const typescript_ioc_1 = require("typescript-ioc");
let ChatService = class ChatService {
    constructor() {
        this.messages = [];
        this.duration = moment_1.default.duration(0, 's');
        this.settingsService.registerChangeListener(async () => {
            this.updateSettings();
            await this.cleanOld();
        });
        this.updateSettings();
    }
    updateSettings() {
        this.duration = moment_1.default.duration(this.settingsService.settings.chat.maxAge.value, this.settingsService.settings.chat.maxAge.unit);
    }
    async cleanOld() {
        const d = moment_1.default().subtract(this.duration).valueOf();
        this.messages = this.messages.filter(c => d < c.created.valueOf());
    }
    async find(time) {
        return this.messages.find(msg => msg.created.valueOf() === time);
    }
    async remove(message) {
        this.messages = this.messages.filter(msg => msg.created.valueOf() !== message.created.valueOf());
    }
    async get(since) {
        await this.cleanOld();
        let list = this.messages;
        if (since !== undefined && !isNaN(since)) {
            list = list.filter(msg => msg.created.valueOf() > since);
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
    typescript_ioc_1.Inject,
    __metadata("design:type", settings_service_1.SettingsService)
], ChatService.prototype, "settingsService", void 0);
ChatService = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map