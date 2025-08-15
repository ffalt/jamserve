import { ArgsType, Field, ID } from 'type-graphql';

@ArgsType()
export class StatsParameters {
	@Field(() => ID, { nullable: true })
	rootID?: string;
}
