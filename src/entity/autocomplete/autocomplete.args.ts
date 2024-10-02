import { ObjField, ObjParamsType } from '../../modules/rest/index.js';

@ObjParamsType()
export class AutoCompleteFilterArgs {
	@ObjField({ description: 'query to complete', example: 'awesome' })
	query!: string;

	@ObjField({ nullable: true, description: 'amount of track names to complete', defaultValue: 0, min: 0, example: 5 })
	track?: number;

	@ObjField({ nullable: true, description: 'amount of artist names to complete', defaultValue: 0, min: 0, example: 5 })
	artist?: number;

	@ObjField({ nullable: true, description: 'amount of album names to complete', defaultValue: 0, min: 0, example: 5 })
	album?: number;

	@ObjField({ nullable: true, description: 'amount of folder names to complete', defaultValue: 0, min: 0, example: 5 })
	folder?: number;

	@ObjField({ nullable: true, description: 'amount of playlist names to complete', defaultValue: 0, min: 0, example: 5 })
	playlist?: number;

	@ObjField({ nullable: true, description: 'amount of podcast names to complete', defaultValue: 0, min: 0, example: 5 })
	podcast?: number;

	@ObjField({ nullable: true, description: 'amount of episode names to complete', defaultValue: 0, min: 0, example: 5 })
	episode?: number;

	@ObjField({ nullable: true, description: 'amount of series names to complete', defaultValue: 0, min: 0, example: 5 })
	series?: number;
}
