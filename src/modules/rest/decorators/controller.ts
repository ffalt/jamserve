import { metadataStorage } from '../metadata/metadata-storage.js';
import { ControllerOptions } from '../../deco/definitions/types.js';
import { BaseController } from '../../deco/decorators/base-controller.js';

export function Controller(route: string, options?: ControllerOptions): ClassDecorator {
	return BaseController(metadataStorage(), route, options);
}
