import {Field, Int, ObjectType} from 'type-graphql';
import {Index, IndexGroup} from '../base/base';

@ObjectType()
export class Genre {
	@Field(() => String)
	name!: string;
	@Field(() => Int)
	trackCount!: number;
	@Field(() => Int)
	albumCount!: number;
	@Field(() => Int)
	artistCount!: number;
	@Field(() => Int)
	seriesCount!: number;
	@Field(() => Int)
	folderCount!: number;
}

@ObjectType()
export class GenreQL extends Genre {
}

@ObjectType()
export class GenreIndexGroupQL extends IndexGroup(Genre, GenreQL) {
}

@ObjectType()
export class GenreIndexQL extends Index(GenreIndexGroupQL) {
}
