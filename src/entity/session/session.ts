import {User} from '../user/user';
import {SessionMode} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, Enum, ManyToOne, Property} from 'mikro-orm';
import {Base, PaginatedResponse} from '../base/base';

@ObjectType()
@Entity()
export class Session extends Base {
	@ManyToOne(() => User)
	user!: User;

	@Field(() => String)
	@Property()
	client!: string;

	@Field(() => String)
	@Property()
	agent!: string;

	@Field(() => Int)
	@Property()
	expires!: number;

	@Field(() => SessionMode)
	@Enum(() => SessionMode)
	mode!: SessionMode;

	@Property()
	sessionID!: string;

	@Property()
	cookie!: string;

	@Property()
	jwth?: string; // hashed jwt
}

@ObjectType()
export class SessionQL extends Session {
}

@ObjectType()
export class SessionPageQL extends PaginatedResponse(Session, SessionQL) {
}
