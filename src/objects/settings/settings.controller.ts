import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {SettingsService} from './settings.service';

export class SettingsController {

	constructor(public settingsService: SettingsService) {
	}

	async admin(req: JamRequest<{}>): Promise<Jam.AdminSettings> {
		return this.settingsService.get();
	}

	async adminUpdate(req: JamRequest<Jam.AdminSettings>): Promise<void> {
		await this.settingsService.updateSettings(req.query);
	}
}
