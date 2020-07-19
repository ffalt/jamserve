import {Inject} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {TransformService} from '../../modules/engine/services/transform.service';
import {Controller} from '../../modules/rest/decorators';
import {MetaDataService} from '../metadata/metadata.service';

@Controller('', {abstract: true})
export class BaseController {
	@Inject
	protected orm!: OrmService;
	@Inject
	protected transform!: TransformService;
	@Inject
	protected metadata!: MetaDataService;
}
