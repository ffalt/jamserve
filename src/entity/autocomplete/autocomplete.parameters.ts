import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class AutoCompleteFilterParameters {
	@ObjectField({ description: 'query to complete', example: 'awesome' })
	query!: string;

	@ObjectField({ nullable: true, description: 'amount of track names to complete', defaultValue: 0, min: 0, example: 5 })
	track?: number;

	@ObjectField({ nullable: true, description: 'amount of artist names to complete', defaultValue: 0, min: 0, example: 5 })
	artist?: number;

	@ObjectField({ nullable: true, description: 'amount of album names to complete', defaultValue: 0, min: 0, example: 5 })
	album?: number;

	@ObjectField({ nullable: true, description: 'amount of folder names to complete', defaultValue: 0, min: 0, example: 5 })
	folder?: number;

	@ObjectField({ nullable: true, description: 'amount of playlist names to complete', defaultValue: 0, min: 0, example: 5 })
	playlist?: number;

	@ObjectField({ nullable: true, description: 'amount of podcast names to complete', defaultValue: 0, min: 0, example: 5 })
	podcast?: number;

	@ObjectField({ nullable: true, description: 'amount of episode names to complete', defaultValue: 0, min: 0, example: 5 })
	episode?: number;

	@ObjectField({ nullable: true, description: 'amount of series names to complete', defaultValue: 0, min: 0, example: 5 })
	series?: number;
}
