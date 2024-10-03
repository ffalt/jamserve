import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, Float } from 'type-graphql';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class ChatCreateArgs {
	@ObjField({ description: 'Chat message', example: 'Hello' })
	message!: string;
}

@ObjParamsType()
export class ChatRemoveArgs {
	@ObjField({ description: 'Chat time', example: examples.timestamp })
	time!: number;
}

@ArgsType()
@ObjParamsType()
export class ChatFilterArgs {
	@Field(() => Float, { nullable: true })
	@ObjField(() => Number, { nullable: true, description: 'filter by message timestamp', min: 0, example: examples.timestamp })
	since?: number;
}
