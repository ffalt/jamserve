import {Field, ID, Int, ObjectType} from 'type-graphql';

@ObjectType()
export class Chat {
	@Field(() => String)
	message!: string;
	@Field(() => Int)
	created!: number;
	@Field(() => String)
	userName!: string;
	@Field(() => ID)
	userID!: string;
}

@ObjectType()
export class ChatQL extends Chat {
}
