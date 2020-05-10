import {DBObjectType} from '../../db/db.types';
import {Radio} from './radio.model';
import {RadioStore, SearchQueryRadio} from './radio.store';
import {BaseListService} from '../base/dbobject-list.service';
import {StateService} from '../state/state.service';

export class RadioService extends BaseListService<Radio, SearchQueryRadio> {

	constructor(public radioStore: RadioStore, stateService: StateService) {
		super(radioStore, stateService);
	}

	defaultSort(items: Array<Radio>): Array<Radio> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async create(name: string, url: string, homepageUrl?: string): Promise<Radio> {
		const radio: Radio = {
			id: '',
			type: DBObjectType.radio,
			name,
			homepage: homepageUrl,
			url,
			created: Date.now(),
			changed: Date.now()
		};
		radio.id = await this.radioStore.add(radio);
		return radio;
	}

	async update(radio: Radio, name?: string, url?: string, homepageUrl?: string): Promise<void> {
		radio.homepage = homepageUrl || radio.homepage;
		radio.url = url || radio.url;
		radio.name = name || radio.name;
		radio.changed = Date.now();
		await this.radioStore.replace(radio);
	}

	async remove(radio: Radio): Promise<void> {
		await this.radioStore.remove(radio.id);
	}
}
