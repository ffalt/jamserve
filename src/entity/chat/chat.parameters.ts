import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, Int } from 'type-graphql';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class ChatCreateParameters {
	@ObjectField({ description: 'Chat message', example: 'Hello' })
	message!: string;
}

@ObjectParametersType()
export class ChatRemoveParameters {
	@ObjectField({ description: 'Chat time', example: examples.timestamp })
	time!: number;
}

@ArgsType()
@ObjectParametersType()
export class ChatFilterParameters {
	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by message timestamp', min: 0, example: examples.timestamp })
	since?: number;
}
