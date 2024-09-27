
import {PlayQueueEntryOrderFields} from '../../types/enums.js';
import {OrderByArgs} from '../base/base.args.js';
import {Field, InputType} from 'type-graphql';
import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@InputType()
@ObjParamsType()
export class PlayQueueEntryOrderArgs extends OrderByArgs {
	@ObjField(() => PlayQueueEntryOrderFields, {nullable: true, description: 'order by field'})
	@Field(() => PlayQueueEntryOrderFields, {nullable: true})
	orderBy?: PlayQueueEntryOrderFields;
}

@InputType()
export class PlayQueueEntryOrderArgsQL extends PlayQueueEntryOrderArgs {
}
