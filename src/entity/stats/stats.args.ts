import {ArgsType, Field, ID} from 'type-graphql';

@ArgsType()
export class StatsArgs {
	@Field(() => ID, {nullable: true})
	rootID?: string;
}
