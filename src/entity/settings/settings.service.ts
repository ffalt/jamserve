import { Settings } from './settings.js';
import { JAMSERVE_VERSION } from '../../version.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { InRequestScope } from 'typescript-ioc';
import { AdminSettings } from '../admin/admin.js';

export const defaultEngineSettings: AdminSettings = {
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

export type SettingChangesListener = () => Promise<void>;

@InRequestScope
export class SettingsService {
	public settings: AdminSettings = { ...defaultEngineSettings };
	private settingsChangeListeners: Array<SettingChangesListener> = [];

	async get(): Promise<AdminSettings> {
		return this.settings;
	}

	async settingsVersion(orm: Orm): Promise<string | undefined> {
		const settingsStore = await SettingsService.getSettings(orm);
		return settingsStore.version;
	}

	async saveSettings(orm: Orm): Promise<void> {
		const settingsStore = await SettingsService.getSettings(orm);
		settingsStore.version = JAMSERVE_VERSION;
		settingsStore.data = JSON.stringify(this.settings);
		await orm.Settings.persistAndFlush(settingsStore);
	}

	async loadSettings(orm: Orm): Promise<void> {
		const settingsStore = await SettingsService.getSettings(orm);
		this.settings = JSON.parse(settingsStore.data);
	}

	private static async getSettings(orm: Orm): Promise<Settings> {
		let settingsStore = await orm.Settings.findOne({ where: { section: 'jamserve' } });
		settingsStore ??= orm.Settings.create({
			section: 'jamserve',
			data: JSON.stringify(defaultEngineSettings),
			version: JAMSERVE_VERSION
		});
		return settingsStore;
	}

	async updateSettings(orm: Orm, settings: AdminSettings): Promise<void> {
		await this.setSettings({ ...this.settings, ...settings });
		await this.saveSettings(orm);
	}

	private async setSettings(settings: AdminSettings): Promise<void> {
		this.settings = settings;
		for (const listener of this.settingsChangeListeners) {
			await listener();
		}
	}

	registerChangeListener(listener: SettingChangesListener): void {
		this.settingsChangeListeners.push(listener);
	}

	unRegisterChangeListener(listener: SettingChangesListener): void {
		this.settingsChangeListeners = this.settingsChangeListeners.filter(l => l !== listener);
	}
}
