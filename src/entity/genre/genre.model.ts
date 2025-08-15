import { Base, Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Genre' })
export class GenreBase extends Base {
}

@ResultType({ description: 'Genre' })
export class Genre extends GenreBase {
	@ObjectField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjectField({ description: 'Track Count', min: 0, example: 55 })
	trackCount!: number;

	@ObjectField({ description: 'Artist Count', min: 0, example: 55 })
	artistCount!: number;

	@ObjectField({ description: 'Folder Count', min: 0, example: 55 })
	folderCount!: number;
}

@ResultType({ description: 'Genre Page' })
export class GenrePage extends Page {
	@ObjectField(() => Genre, { description: 'List of Genre' })
	items!: Array<Genre>;
}

@ResultType({ description: 'Genre Index Entry' })
export class GenreIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Awesome' })
	name!: string;

	@ObjectField({ description: 'Track Count', min: 0, example: 5 })
	trackCount!: number;

	@ObjectField({ description: 'Artist Count', min: 0, example: 5 })
	artistCount!: number;

	@ObjectField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjectField({ description: 'Folder Count', min: 0, example: 5 })
	folderCount!: number;
}

@ResultType({ description: 'Genre Index Group' })
export class GenreIndexGroup {
	@ObjectField({ description: 'Genre Group Name', example: 'A' })
	name!: string;

	@ObjectField(() => [GenreIndexEntry])
	items!: Array<GenreIndexEntry>;
}

@ResultType({ description: 'Genre Index' })
export class GenreIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [GenreIndexGroup], { description: 'Genre Index Groups' })
	groups!: Array<GenreIndexGroup>;
}
