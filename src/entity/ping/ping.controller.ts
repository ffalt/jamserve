import {Controller, Get} from '../../modules/rest/decorators';
import {Ping} from './ping.model';
import {JAMAPI_VERSION} from '../../modules/engine/rest/version';
import {InRequestScope} from 'typescript-ioc';

@InRequestScope
@Controller('/ping', {tags: ['Access']})
export class PingController {
	@Get(() => Ping, {description: 'Is the Api online?', summary: 'Ping'})
	ping(): Ping {
		return {version: JAMAPI_VERSION};
	}
}
