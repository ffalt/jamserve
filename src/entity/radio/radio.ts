import {Field, ObjectType} from 'type-graphql';
import {Entity, Property} from 'mikro-orm';
import {Base, Index, IndexGroup, PaginatedResponse} from '../base/base';
import {State, StateQL} from '../state/state';

@ObjectType()
@Entity()
export class Radio extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	url!: string;

	@Field(() => String, {nullable: true})
	@Property()
	homepage?: string;

	@Field(() => Boolean)
	@Property()
	disabled: boolean = false;
}

@ObjectType()
export class RadioQL extends Radio {
	@Field(() => StateQL)
	state!: State
}

@ObjectType()
export class RadioPageQL extends PaginatedResponse(Radio, RadioQL) {
}

@ObjectType()
export class RadioIndexGroupQL extends IndexGroup(Radio, RadioQL) {
}

@ObjectType()
export class RadioIndexQL extends Index(RadioIndexGroupQL) {
}
