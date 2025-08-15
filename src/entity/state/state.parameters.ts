import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class FavParameters {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'add or remove the item fav', example: false, defaultValue: false })
	remove?: boolean;
}

@ObjectParametersType()
export class RateParameters {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Rating', example: false, min: 0, max: 5 })
	rating!: number;
}

@ObjectParametersType()
export class StatesParameters {
	@ObjectField(() => [String], { description: 'IDs', isID: true })
	ids!: Array<string>;
}
