import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class StatsFilter {
	@ObjectField({ nullable: true, description: 'filter stats by Root Id', isID: true })
	rootID?: string;
}
