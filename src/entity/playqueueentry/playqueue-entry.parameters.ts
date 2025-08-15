import { PlayQueueEntryOrderFields } from '../../types/enums.js';
import { OrderByParameters } from '../base/base.parameters.js';
import { Field, InputType } from 'type-graphql';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@InputType()
@ObjectParametersType()
export class PlayQueueEntryOrderParameters extends OrderByParameters {
	@ObjectField(() => PlayQueueEntryOrderFields, { nullable: true, description: 'order by field' })
	@Field(() => PlayQueueEntryOrderFields, { nullable: true })
	orderBy?: PlayQueueEntryOrderFields;
}

@InputType()
export class PlayQueueEntryOrderParametersQL extends PlayQueueEntryOrderParameters {
}
