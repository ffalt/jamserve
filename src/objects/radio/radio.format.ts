import {Jam} from '../../model/jam-rest-data-0.1.0';
import {Radio} from './radio.model';

export function formatRadio(radio: Radio): Jam.Radio {
	return {
		id: radio.id,
		url: radio.url,
		created: radio.created,
		updated: radio.updated,
		name: radio.name,
		homepage: radio.homepage,
	};
}
