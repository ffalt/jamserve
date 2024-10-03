import { Base, Page } from '../base/base.model.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Genre' })
export class GenreBase extends Base {
}

@ResultType({ description: 'Genre' })
export class Genre extends GenreBase {
	@ObjField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjField({ description: 'Track Count', min: 0, example: 55 })
	trackCount!: number;

	@ObjField({ description: 'Artist Count', min: 0, example: 55 })
	artistCount!: number;

	@ObjField({ description: 'Folder Count', min: 0, example: 55 })
	folderCount!: number;
}

@ResultType({ description: 'Genre Page' })
export class GenrePage extends Page {
	@ObjField(() => Genre, { description: 'List of Genre' })
	items!: Array<Genre>;
}

@ResultType({ description: 'Genre Index Entry' })
export class GenreIndexEntry {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Name', example: 'Awesome' })
	name!: string;

	@ObjField({ description: 'Track Count', min: 0, example: 5 })
	trackCount!: number;

	@ObjField({ description: 'Artist Count', min: 0, example: 5 })
	artistCount!: number;

	@ObjField({ description: 'Album Count', min: 0, example: 5 })
	albumCount!: number;

	@ObjField({ description: 'Folder Count', min: 0, example: 5 })
	folderCount!: number;
}

@ResultType({ description: 'Genre Index Group' })
export class GenreIndexGroup {
	@ObjField({ description: 'Genre Group Name', example: 'A' })
	name!: string;

	@ObjField(() => [GenreIndexEntry])
	items!: Array<GenreIndexEntry>;
}

@ResultType({ description: 'Genre Index' })
export class GenreIndex {
	@ObjField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjField(() => [GenreIndexGroup], { description: 'Genre Index Groups' })
	groups!: Array<GenreIndexGroup>;
}
