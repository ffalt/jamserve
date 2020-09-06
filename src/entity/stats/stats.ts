import {Field, ID, Int, ObjectType} from 'type-graphql';

@ObjectType()
export class StatsAlbumTypesQL {
	@Field(() => Int)
	album!: number;
	@Field(() => Int)
	compilation!: number;
	@Field(() => Int)
	artistCompilation!: number;
	@Field(() => Int)
	live!: number;
	@Field(() => Int)
	audiobook!: number;
	@Field(() => Int)
	soundtrack!: number;
	@Field(() => Int)
	series!: number;
	@Field(() => Int)
	bootleg!: number;
	@Field(() => Int)
	ep!: number;
	@Field(() => Int)
	single!: number;
	@Field(() => Int)
	unknown!: number;
}

@ObjectType()
export class StatsQL {
	@Field(() => ID, {nullable: true})
	rootID?: string;
	@Field(() => Int)
	track!: number;
	@Field(() => Int)
	folder!: number;
	@Field(() => Int)
	series!: number;
	@Field(() => Int)
	artist!: number;
	@Field(() => StatsAlbumTypesQL)
	artistTypes!: StatsAlbumTypesQL;
	@Field(() => Int)
	album!: number;
	@Field(() => StatsAlbumTypesQL)
	albumTypes!: StatsAlbumTypesQL;
}

@ObjectType()
export class UserDetailStatsQL {
	@Field(() => Int)
	track!: number;
	@Field(() => Int)
	folder!: number;
	@Field(() => Int)
	series!: number;
	@Field(() => Int)
	artist!: number;
	@Field(() => StatsAlbumTypesQL)
	artistTypes!: StatsAlbumTypesQL;
	@Field(() => Int)
	album!: number;
	@Field(() => StatsAlbumTypesQL)
	albumTypes!: StatsAlbumTypesQL;
}

@ObjectType()
export class UserStatsQL {
	@Field(() => Int)
	playlist!: number;
	@Field(() => Int)
	bookmark!: number;
	@Field(() => UserDetailStatsQL)
	favorite!: UserDetailStatsQL;
	@Field(() => UserDetailStatsQL)
	played!: UserDetailStatsQL;
}
