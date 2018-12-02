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
			updated: Date.now()
		};
		radio.id = await this.radioStore.add(radio);
		return radio;
	}

	async updateRadio(radio: Radio): Promise<void> {
		radio.updated = Date.now();
		await this.radioStore.replace(radio);
	}

	async removeRadio(radio: Radio): Promise<void> {
		await this.radioStore.remove(radio.id);
	}
}
