import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class FavArgs {
	@ObjField({description: 'ID', isID: true})
	id!: string;
	@ObjField({description: 'add or remove the item fav', example: false, defaultValue: false})
	remove?: boolean;
}

@ObjParamsType()
export class RateArgs {
	@ObjField({description: 'ID', isID: true})
	id!: string;
	@ObjField({description: 'Rating', example: false, min: 0, max: 5})
	rating!: number;
}

@ObjParamsType()
export class StatesArgs {
	@ObjField(() => [String], {description: 'IDs', isID: true})
	ids!: Array<string>;
}
