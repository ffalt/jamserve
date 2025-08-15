import { ListType, RootScanStrategy } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { DefaultOrderParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class IncludesRootParameters {
}

@ObjectParametersType()
export class RootMutateParameters {
	@ObjectField({ description: 'Root Name', example: 'Compilations' })
	name!: string;

	@ObjectField({ description: 'Absolute Path for Root ', example: '/var/media/compilations' })
	path!: string;

	@ObjectField(() => RootScanStrategy, { description: 'Scan Strategy', example: RootScanStrategy.compilation })
	strategy!: RootScanStrategy;
}

@ObjectParametersType()
export class RootRefreshParameters {
	@ObjectField({ nullable: true, description: 'Root ID to refresh (empty for refreshing all)', isID: true })
	id?: string;
}

@InputType()
@ObjectParametersType()
export class RootFilterParameters {
	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Search Query', example: 'compilations' })
	query?: string;

	@Field(() => String, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Compilations' })
	name?: string;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true })
	ids?: Array<string>;

	@Field(() => Int, { nullable: true })
	@ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp })
	since?: number;

	@Field(() => [RootScanStrategy])
	@ObjectField(() => [RootScanStrategy], { nullable: true, description: 'filter by Scan Strategy', example: [RootScanStrategy.auto] })
	strategies?: Array<RootScanStrategy>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true })
	trackIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true })
	folderIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true })
	albumIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true })
	artistIDs?: Array<string>;

	@Field(() => [ID], { nullable: true })
	@ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true })
	seriesIDs?: Array<string>;
}

@InputType()
export class RootFilterParametersQL extends RootFilterParameters {
}

@InputType()
@ObjectParametersType()
export class RootOrderParameters extends DefaultOrderParameters {
}

@InputType()
export class RootOrderParametersQL extends RootOrderParameters {
}

@ArgsType()
export class RootsParameters extends PaginatedFilterParameters(RootFilterParametersQL, RootOrderParametersQL) {
	@Field(() => ListType, { nullable: true })
	list?: ListType;

	@Field(() => String, { nullable: true })
	seed?: string;
}
