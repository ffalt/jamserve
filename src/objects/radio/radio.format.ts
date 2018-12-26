import {Jam} from '../../model/jam-rest-data';
import {Radio} from './radio.model';

export function formatRadio(radio: Radio): Jam.Radio {
	return {
		id: radio.id,
		url: radio.url,
		created: radio.created,
		changed: radio.changed,
		name: radio.name,
		homepage: radio.homepage,
	};
}
