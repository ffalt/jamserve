import { Field, ObjectType } from 'type-graphql';
import { Entity, Property } from '../../modules/orm/index.js';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';

@ObjectType()
@Entity()
export class Radio extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	url!: string;

	@Field(() => String, { nullable: true })
	@Property(() => String, { nullable: true })
	homepage?: string;

	@Field(() => Boolean)
	@Property(() => Boolean)
	disabled: boolean = false;
}

@ObjectType()
export class RadioQL extends Radio {
	@Field(() => StateQL)
	state!: State;
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
