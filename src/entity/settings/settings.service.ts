import {Settings} from './settings';
import {JAMSERVE_VERSION} from '../../version';
import {Orm} from '../../modules/engine/services/orm.service';
import {InRequestScope} from 'typescript-ioc';

export interface AdminSettingsChat {
	maxMessages: number;
	maxAge: {
		value: number;
		unit: string;
	};
}

export interface AdminSettingsIndex {
	ignoreArticles: Array<string>;
}

export interface AdminSettingsLibrary {
	scanAtStart: boolean;
}

export interface AdminSettingsExternal {
	enabled: boolean;
}

export interface AdminSettings {
	chat: AdminSettingsChat;
	index: AdminSettingsIndex;
	library: AdminSettingsLibrary;
	externalServices: AdminSettingsExternal;
}

export const defaultEngineSettings: AdminSettings = {
	chat: {
		maxMessages: 100,
		maxAge: {value: 1, unit: 'day'}
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
	public settings: AdminSettings = {...defaultEngineSettings};
	private settingsChangeListeners: Array<SettingChangesListener> = [];

	async get(): Promise<AdminSettings> {
		return this.settings;
	}

	async settingsVersion(orm: Orm): Promise<string | undefined> {
		const settings = await this.getSettings(orm);
		return settings.version;
	}

	async saveSettings(orm: Orm): Promise<void> {
		const settings = await this.getSettings(orm);
		settings.version = JAMSERVE_VERSION;
		settings.data = JSON.stringify(this.settings);
		await orm.Settings.persistAndFlush(settings);
	}

	private async getSettings(orm: Orm): Promise<Settings> {
		let settings = await orm.Settings.findOne({where: {section: 'jamserve'}});
		if (!settings) {
			settings = orm.Settings.create({
				section: 'jamserve',
				data: JSON.stringify(defaultEngineSettings),
				version: JAMSERVE_VERSION
			})
		}
		return settings;
	}

	async loadSettings(orm: Orm): Promise<void> {
		const settings = await this.getSettings(orm);
		await this.setSettings(JSON.parse(settings.data));
	}

	async updateSettings(orm: Orm, settings: AdminSettings): Promise<void> {
		await this.setSettings(settings);
		await this.saveSettings(orm);
	}

	private async setSettings(settings: AdminSettings): Promise<void> {
		this.settings = settings;
		for (const listener of this.settingsChangeListeners) {
			await listener();
		}
	}

	public registerChangeListener(listener: SettingChangesListener) {
		this.settingsChangeListeners.push(listener);
	}

	public unRegisterChangeListener(listener: SettingChangesListener) {
		this.settingsChangeListeners = this.settingsChangeListeners.filter(l => l !== listener);
	}
}
