import {User} from '../user/user';
import {DBObjectType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Base} from '../base/base';
import {Entity, ManyToOne, ORM_ID, ORM_INT, ORM_TIMESTAMP, Property, Reference} from '../../modules/orm';

@ObjectType()
@Entity()
export class State extends Base {
	@Property(() => ORM_ID)
	destID!: string;

	@Property(() => DBObjectType)
	destType!: DBObjectType;

	@Field(() => Date, {nullable: true})
	@Property(() => ORM_TIMESTAMP, {nullable: true})
	faved?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	played?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	rated?: number;

	@Field(() => Date, {nullable: true})
	@Property(() => ORM_TIMESTAMP, {nullable: true})
	lastPlayed?: number;

	@ManyToOne<User>(() => User, user => user.states)
	user: Reference<User> = new Reference<User>(this);
}

@ObjectType()
export class StateQL extends State {
}
