import {defaultSettings} from '../../config/settings.default';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {ChatService} from '../chat/chat.service';
import {IndexService} from '../index/index.service';
import {ScanService} from '../scan/scan.service';
import {SettingsStore} from './settings.store';

export class SettingsService {
	public settings: Jam.AdminSettings = defaultSettings;

	constructor(public settingsStore: SettingsStore, private chatService: ChatService, private indexService: IndexService, private scanService: ScanService, private version: string) {
	}

	async get(): Promise<Jam.AdminSettings> {
		return this.settings;
	}

	async loadSettings(): Promise<void> {
		let settings = await this.settingsStore.searchOne({section: 'jamserve'});
		if (!settings) {
			settings = {
				id: '',
				type: DBObjectType.settings,
				section: 'jamserve',
				data: defaultSettings,
				version: this.version
			};
			await this.settingsStore.add(settings);
		}
		this.setSettings(settings.data);
	}

	async updateSettings(settings: Jam.AdminSettings): Promise<void> {
		this.setSettings(settings);
	}

	private setSettings(settings: Jam.AdminSettings): void {
		this.settings = settings;
		this.chatService.setSettings(this.settings.chat);
		this.indexService.setSettings(this.settings.index);
		this.scanService.setSettings(this.settings.library);
	}
}
