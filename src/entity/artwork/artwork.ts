import {Folder, FolderQL} from '../folder/folder';
import {ArtworkImageType} from '../../types/enums';
import {Field, Int, ObjectType} from 'type-graphql';
import {Entity, ManyToOne, ORM_INT, ORM_TIMESTAMP, Property, Reference} from '../../modules/orm';
import {Base, PaginatedResponse} from '../base/base';

@ObjectType()
@Entity()
export class Artwork extends Base {
	@Field(() => String)
	@Property(() => String)
	name!: string;

	@Field(() => String)
	@Property(() => String)
	path!: string;

	@Field(() => [ArtworkImageType])
	@Property(() => [ArtworkImageType])
	types: Array<ArtworkImageType> = [];

	@Field(() => Int)
	@Property(() => ORM_TIMESTAMP)
	statCreated!: number;

	@Field(() => Int)
	@Property(() => ORM_TIMESTAMP)
	statModified!: number;

	@Field(() => Int)
	@Property(() => ORM_INT)
	fileSize!: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	width?: number;

	@Field(() => Int, {nullable: true})
	@Property(() => ORM_INT, {nullable: true})
	height?: number;

	@Field(() => String, {nullable: true})
	@Property(() => String, {nullable: true})
	format?: string;

	@Field(() => FolderQL)
	@ManyToOne<Folder>(() => Folder, folder => folder.artworks)
	folder: Reference<Folder> = new Reference<Folder>(this);
}

@ObjectType()
export class ArtworkQL extends Artwork {
}

@ObjectType()
export class ArtworkPageQL extends PaginatedResponse(Artwork, ArtworkQL) {
}
