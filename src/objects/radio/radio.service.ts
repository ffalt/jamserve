import {DBObjectType} from '../../types';
import {Radio} from './radio.model';
import {RadioStore} from './radio.store';

export class RadioService {

	constructor(private radioStore: RadioStore) {
	}

	async addRadio(name: string, url: string, homepageUrl?: string): Promise<Radio> {
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

	async updateRadio(radio: Radio, name?: string, url?: string, homepageUrl?: string): Promise<void> {
		radio.homepage = homepageUrl || radio.homepage;
		radio.url = url || radio.url;
		radio.name = name || radio.name;
		radio.changed = Date.now();
		await this.radioStore.replace(radio);
	}

	async removeRadio(radio: Radio): Promise<void> {
		await this.radioStore.remove(radio.id);
	}
}
