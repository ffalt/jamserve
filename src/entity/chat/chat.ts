import {Field, ID, ObjectType} from 'type-graphql';

@ObjectType()
export class Chat {
	@Field(() => String)
	message!: string;
	@Field(() => Date)
	created!: number;
	@Field(() => String)
	userName!: string;
	@Field(() => ID)
	userID!: string;
}

@ObjectType()
export class ChatQL extends Chat {
}
