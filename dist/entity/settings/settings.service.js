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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = exports.defaultEngineSettings = void 0;
const version_1 = require("../../version");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const typescript_ioc_1 = require("typescript-ioc");
exports.defaultEngineSettings = {
    chat: {
        maxMessages: 100,
        maxAge: { value: 1, unit: 'day' }
    },
    index: {
        ignoreArticles: ['The', 'El', 'La', 'Los', 'Las', 'Le', 'Les', 'Die']
    },
    library: {
        scanAtStart: true
    },
    externalServices: {
        enabled: false
    }
};
let SettingsService = class SettingsService {
    constructor() {
        this.settings = { ...exports.defaultEngineSettings };
        this.settingsChangeListeners = [];
    }
    async get() {
        return this.settings;
    }
    async settingsVersion() {
        const settings = await this.getSettings();
        return settings.version;
    }
    async saveSettings() {
        const settings = await this.getSettings();
        settings.version = version_1.JAMSERVE_VERSION;
        settings.data = this.settings;
        await this.orm.orm.em.flush();
    }
    async getSettings() {
        let settings = await this.orm.Settings.findOne({ section: { $eq: 'jamserve' } });
        if (!settings) {
            settings = this.orm.Settings.create({
                section: 'jamserve',
                data: exports.defaultEngineSettings,
                version: version_1.JAMSERVE_VERSION
            });
            this.orm.orm.em.persistLater(settings);
        }
        return settings;
    }
    async loadSettings() {
        const settings = await this.getSettings();
        await this.setSettings(settings.data);
    }
    async updateSettings(settings) {
        await this.setSettings(settings);
        await this.saveSettings();
    }
    async setSettings(settings) {
        this.settings = settings;
        for (const listener of this.settingsChangeListeners) {
            await listener();
        }
    }
    registerChangeListener(listener) {
        this.settingsChangeListeners.push(listener);
    }
    unRegisterChangeListener(listener) {
        this.settingsChangeListeners = this.settingsChangeListeners.filter(l => l !== listener);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], SettingsService.prototype, "orm", void 0);
SettingsService = __decorate([
    typescript_ioc_1.Singleton
], SettingsService);
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map