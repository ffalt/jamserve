import {BaseController} from '../base/base.controller';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {JamRequest} from '../../api/jam/api';
import {formatRadio} from './radio.format';
import {RadioService} from './radio.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../../engine/image/image.service';
import {DownloadService} from '../../engine/download/download.service';
import {RadioStore, SearchQueryRadio} from './radio.store';
import {Radio} from './radio.model';
import {User} from '../user/user.model';

export class RadioController extends BaseController<JamParameters.Radio, JamParameters.Radios, JamParameters.IncludesRadio, SearchQueryRadio, JamParameters.RadioSearch, Radio, Jam.Radio> {

	constructor(
		private radioStore: RadioStore,
		private radioService: RadioService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(radioStore, DBObjectType.radio, stateService, imageService, downloadService);
	}

	defaultSort(items: Array<Radio>): Array<Radio> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async prepare(radio: Radio, includes: JamParameters.IncludesRadio, user: User): Promise<Jam.Radio> {
		const result = formatRadio(radio);
		if (includes.radioState) {
			const state = await this.stateService.findOrCreate(radio.id, user.id, DBObjectType.radio);
			result.state = formatState(state);
		}
		return result;
	}

	translateQuery(query: JamParameters.RadioSearch, user: User): SearchQueryRadio {
		return {
			query: query.query,
			url: query.url,
			name: query.name,
			homepage: query.homepage,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async create(req: JamRequest<JamParameters.RadioNew>): Promise<Jam.Radio> {
		const radio = await this.radioService.addRadio(req.query.name, req.query.url, req.query.homepage);
		return this.prepare(radio, {radioState: true}, req.user);
	}

	async update(req: JamRequest<JamParameters.RadioUpdate>): Promise<void> {
		const radio = await this.byID(req.query.id);
		if (req.query.homepage) {
			radio.homepage = req.query.homepage;
		}
		if (req.query.url) {
			radio.url = req.query.url;
		}
		if (req.query.name) {
			radio.name = req.query.name;
		}
		await this.radioService.updateRadio(radio);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const radio = await this.byID(req.query.id);
		await this.radioService.removeRadio(radio);
	}

}
