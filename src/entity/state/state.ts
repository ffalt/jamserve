import {User} from '../user/user';
import {DBObjectType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Base} from '../base/base';
import {Entity, Enum, ManyToOne, Property} from 'mikro-orm';

@ObjectType()
@Entity()
export class State extends Base {

	@Property()
	destID!: string;

	@Enum(() => DBObjectType)
	destType!: DBObjectType;

	@Field(() => Int, {nullable: true})
	@Property()
	faved?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	played?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	rated?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	lastPlayed?: number;

	@ManyToOne(() => User)
	user!: User;
}

@ObjectType()
export class StateQL extends State {
}
