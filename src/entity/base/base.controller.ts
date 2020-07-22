import {Inject, InRequestScope} from 'typescript-ioc';
import {TransformService} from '../../modules/engine/services/transform.service';
import {Controller} from '../../modules/rest/decorators';
import {MetaDataService} from '../metadata/metadata.service';

@InRequestScope
@Controller('', {abstract: true})
export class BaseController {
	@Inject
	protected transform!: TransformService;
	@Inject
	protected metadata!: MetaDataService;
}
