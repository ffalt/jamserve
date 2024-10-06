import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, Int } from 'type-graphql';
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
	@Field(() => Int, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by message timestamp', min: 0, example: examples.timestamp })
	since?: number;
}
