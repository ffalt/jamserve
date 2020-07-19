import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {examples} from '../../modules/engine/rest/example.consts';
import {ArgsType, Field, Int} from 'type-graphql';

@ObjParamsType()
export class ChatCreateArgs {
	@ObjField({description: 'Chat message', example: 'Hello'})
	message!: string;
}

@ObjParamsType()
export class ChatRemoveArgs {
	@ObjField({description: 'Chat time', example: examples.timestamp})
	time!: number;
}

@ArgsType()
@ObjParamsType()
export class ChatFilterArgs {
	@Field(() => Int, {nullable: true})
	@ObjField(() => Number, {nullable: true, description: 'filter by message timestamp', min: 0, example: examples.timestamp})
	since?: number;
}
