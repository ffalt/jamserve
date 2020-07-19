import {Settings} from './settings';
import {JAMSERVE_VERSION} from '../../version';
import {OrmService} from '../../modules/engine/services/orm.service';
import {Inject, Singleton} from 'typescript-ioc';

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

@Singleton
export class SettingsService {
	@Inject
	private orm!: OrmService;

	public settings: AdminSettings = {...defaultEngineSettings};
	private settingsChangeListeners: Array<SettingChangesListener> = [];

	async get(): Promise<AdminSettings> {
		return this.settings;
	}

	async settingsVersion(): Promise<string | undefined> {
		const settings = await this.getSettings();
		return settings.version;
	}

	async saveSettings(): Promise<void> {
		const settings = await this.getSettings();
		settings.version = JAMSERVE_VERSION;
		settings.data = this.settings;
		await this.orm.orm.em.flush();
	}

	private async getSettings(): Promise<Settings> {
		let settings = await this.orm.Settings.findOne({section: {$eq: 'jamserve'}});
		if (!settings) {
			settings = this.orm.Settings.create({
				section: 'jamserve',
				data: defaultEngineSettings,
				version: JAMSERVE_VERSION
			})
			this.orm.orm.em.persistLater(settings);
		}
		return settings;
	}

	async loadSettings(): Promise<void> {
		const settings = await this.getSettings();
		await this.setSettings(settings.data as AdminSettings);
	}

	async updateSettings(settings: AdminSettings): Promise<void> {
		await this.setSettings(settings);
		await this.saveSettings();
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
