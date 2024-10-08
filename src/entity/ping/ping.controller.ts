import { Ping } from './ping.model.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';

@Controller('/ping', { tags: ['Access'] })
export class PingController {
	@Get(() => Ping, { description: 'Is the Api online?', summary: 'Ping' })
	ping(): Ping {
		return { version: JAMAPI_VERSION };
	}
}
