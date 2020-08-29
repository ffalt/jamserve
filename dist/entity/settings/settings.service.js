"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = exports.defaultEngineSettings = void 0;
const version_1 = require("../../version");
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
    async settingsVersion(orm) {
        const settingsStore = await this.getSettings(orm);
        return settingsStore.version;
    }
    async saveSettings(orm) {
        const settingsStore = await this.getSettings(orm);
        settingsStore.version = version_1.JAMSERVE_VERSION;
        settingsStore.data = JSON.stringify(this.settings);
        await orm.Settings.persistAndFlush(settingsStore);
    }
    async loadSettings(orm) {
        const settingsStore = await this.getSettings(orm);
        if (settingsStore) {
            this.settings = JSON.parse(settingsStore.data);
        }
    }
    async getSettings(orm) {
        let settingsStore = await orm.Settings.findOne({ where: { section: 'jamserve' } });
        if (!settingsStore) {
            settingsStore = orm.Settings.create({
                section: 'jamserve',
                data: JSON.stringify(exports.defaultEngineSettings),
                version: version_1.JAMSERVE_VERSION
            });
        }
        return settingsStore;
    }
    async updateSettings(orm, settings) {
        await this.setSettings({ ...this.settings, ...settings });
        await this.saveSettings(orm);
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
SettingsService = __decorate([
    typescript_ioc_1.InRequestScope
], SettingsService);
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map