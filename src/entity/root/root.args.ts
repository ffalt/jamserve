import { ListType, RootScanStrategy } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { DefaultOrderArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class IncludesRootArgs {
}

@ObjParamsType()
export class RootMutateArgs {
	@ObjField({ description: 'Root Name', example: 'Compilations' })
	name!: string;

	@ObjField({ description: 'Absolute Path for Root ', example: '/var/media/compilations' })
	path!: string;

	@ObjField(() => RootScanStrategy, { description: 'Scan Strategy', example: RootScanStrategy.compilation })
	strategy!: RootScanStrategy;
}

@ObjParamsType()
export class RootRefreshArgs {
	@ObjField({ nullable: true, description: 'Root ID to refresh (empty for refreshing all)', isID: true })
	id?: string;
}

@InputType()
@ObjParamsType()
export class RootFilterArgs {
	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Search Query', example: 'compilations' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Compilations' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true })
	ids?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [RootScanStrategy])
	@ObjField(() => [RootScanStrategy], { nullable: true, description: 'filter by Scan Strategy', example: [RootScanStrategy.auto] })
	strategies?: Array<RootScanStrategy>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true })
	albumIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true })
	artistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true })
	seriesIDs?: Array<string>;
}

@InputType()
export class RootFilterArgsQL extends RootFilterArgs {
}

@InputType()
@ObjParamsType()
export class RootOrderArgs extends DefaultOrderArgs {
}

@InputType()
export class RootOrderArgsQL extends RootOrderArgs {
}

@ArgsType()
export class RootsArgs extends PaginatedFilterArgs(RootFilterArgsQL, RootOrderArgsQL) {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
