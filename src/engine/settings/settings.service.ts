import {defaultSettings} from '../../config/settings.default';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {AudioModule} from '../../modules/audio/audio.module';
import {ChatService} from '../chat/chat.service';
import {IndexService} from '../index/index.service';
import {WorkerService} from '../worker/worker.service';
import {Settings} from './settings.model';
import {SettingsStore} from './settings.store';

export class SettingsService {
	public settings: Jam.AdminSettings = defaultSettings();

	constructor(
		public settingsStore: SettingsStore, private chatService: ChatService,
		private indexService: IndexService, private workerService: WorkerService,
		private audiomodule: AudioModule,
		private version: string) {
	}

	async get(): Promise<Jam.AdminSettings> {
		return this.settings;
	}

	async settingsVersion(): Promise<string | undefined> {
		const settings = await this.getSettings();
		return settings.version;
	}

	async saveSettings(): Promise<void> {
		const settings = await this.getSettings();
		settings.version = this.version;
		settings.data = this.settings;
		await this.settingsStore.upsert([settings]);
	}

	private initSettingsStoreObj(): Settings {
		return {
			id: '',
			type: DBObjectType.settings,
			section: 'jamserve',
			data: defaultSettings(),
			version: this.version
		};
	}

	private async getSettings(): Promise<Settings> {
		let settings = await this.settingsStore.searchOne({section: 'jamserve'});
		if (!settings) {
			settings = this.initSettingsStoreObj();
			settings.id = await this.settingsStore.add(settings);
		} else {
			settings.data = {...defaultSettings(), ...settings.data};
		}
		return settings;
	}

	async loadSettings(): Promise<void> {
		const settings = await this.getSettings();
		this.setSettings(settings.data);
	}

	async updateSettings(settings: Jam.AdminSettings): Promise<void> {
		this.setSettings(settings);
		await this.saveSettings();
	}

	private setSettings(settings: Jam.AdminSettings): void {
		this.settings = settings;
		this.chatService.setSettings(this.settings.chat);
		this.indexService.setSettings(this.settings.index);
		this.workerService.setSettings(this.settings.library);
		this.audiomodule.setSettings(this.settings.externalServices);
	}
}
