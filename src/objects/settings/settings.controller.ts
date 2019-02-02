import {SettingsService} from './settings.service';
import {Jam} from '../../model/jam-rest-data';
import {JamRequest} from '../../api/jam/api';

export class SettingsController {

	constructor(public settingsService: SettingsService) {
	}

	async admin(req: JamRequest<{}>): Promise<Jam.AdminSettings> {
		return await this.settingsService.get();
	}

	async adminUpdate(req: JamRequest<Jam.AdminSettings>): Promise<void> {
		await this.settingsService.updateSettings(req.query);
	}
}
