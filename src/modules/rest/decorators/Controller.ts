import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {ControllerOptions} from '../../deco/definitions/types.js';
import {BaseController} from '../../deco/decorators/Controller.js';

export function Controller(route: string, options?: ControllerOptions): ClassDecorator {
	return BaseController(getMetadataStorage(), route, options);
}
