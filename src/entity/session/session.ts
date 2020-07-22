import {User} from '../user/user';
import {SessionMode} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, ORM_TIMESTAMP, Property, Reference} from '../../modules/orm';
import {Base, PaginatedResponse} from '../base/base';

@ObjectType()
@Entity()
export class Session extends Base {
	@ManyToOne<User>(() => User, user => user.sessions)
	user: Reference<User> = new Reference<User>(this);

	@Field(() => String)
	@Property(() => String)
	client!: string;

	@Field(() => String)
	@Property(() => String)
	agent!: string;

	@Field(() => Int)
	@Property(() => ORM_TIMESTAMP)
	expires!: number;

	@Field(() => SessionMode)
	@Property(() => SessionMode)
	mode!: SessionMode;

	@Property(() => String)
	sessionID!: string;

	@Property(() => String)
	cookie!: string;

	@Property(() => String, {nullable: true})
	jwth?: string; // hashed jwt
}

@ObjectType()
export class SessionQL extends Session {
}

@ObjectType()
export class SessionPageQL extends PaginatedResponse(Session, SessionQL) {
}
