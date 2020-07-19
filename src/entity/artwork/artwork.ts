import {Folder, FolderQL} from '../folder/folder';
import {ArtworkImageType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, Property} from 'mikro-orm';
import {Base, PaginatedResponse} from '../base/base';
import {OrmStringListType} from '../../modules/engine/services/orm.types';

@ObjectType()
@Entity()
export class Artwork extends Base {
	@Field(() => String)
	@Property()
	name!: string;

	@Field(() => String)
	@Property()
	path!: string;

	@Field(() => [ArtworkImageType])
	@Property({type: OrmStringListType})
	types: Array<ArtworkImageType> = [];

	@Field(() => Int)
	@Property()
	statCreated!: number;

	@Field(() => Int)
	@Property()
	statModified!: number;

	@Field(() => Int)
	@Property()
	fileSize!: number;

	@Field(() => Int, {nullable: true})
	@Property()
	width?: number;

	@Field(() => Int, {nullable: true})
	@Property()
	height?: number;

	@Field(() => String, {nullable: true})
	@Property()
	format?: string;

	@Field(() => FolderQL)
	@ManyToOne(() => Folder)
	folder!: Folder;
}

@ObjectType()
export class ArtworkQL extends Artwork {
}

@ObjectType()
export class ArtworkPageQL extends PaginatedResponse(Artwork, ArtworkQL) {
}
