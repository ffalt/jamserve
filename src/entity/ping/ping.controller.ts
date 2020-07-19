import {Controller, Get} from '../../modules/rest/decorators';
import {Ping} from './ping.model';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';

@Controller('/ping', {tags: ['Access']})
export class PingController {
	@Get(() => Ping, {description: 'Is the Api online?', summary: 'Ping'})
	ping(): Ping {
		return {version: JAMAPI_VERSION};
	}
}
