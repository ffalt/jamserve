import {User} from '../user/user.js';
import {SessionMode} from '../../types/enums.js';
import {Field, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, ORM_DATETIME, Property, Reference} from '../../modules/orm/index.js';
import {Base, PaginatedResponse} from '../base/base.js';

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

	@Field(() => Date, {nullable:true})
	@Property(() => ORM_DATETIME, {nullable: true})
	expires?: Date;

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
