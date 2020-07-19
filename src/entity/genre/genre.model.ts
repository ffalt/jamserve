import {ObjField, ResultType} from '../../modules/rest/decorators';
import {Page} from '../base/base.model';

@ResultType({description: 'Genre'})
export class Genre {
	@ObjField({description: 'Name', example: 'Pop'})
	name!: string;
	@ObjField({description: 'Album Count', min: 0, example: 5})
	albumCount!: number;
	@ObjField({description: 'Track Count', min: 0, example: 55})
	trackCount!: number;
	@ObjField({description: 'Artist Count', min: 0, example: 55})
	artistCount!: number;
	@ObjField({description: 'Series Count', min: 0, example: 5})
	seriesCount!: number;
	@ObjField({description: 'Folder Count', min: 0, example: 55})
	folderCount!: number;
}

@ResultType({description: 'Genre Page'})
export class GenrePage extends Page {
	@ObjField(() => Genre, {description: 'List of Genre'})
	items!: Array<Genre>;
}


@ResultType({description: 'Playlist Index Group'})
export class GenreIndexGroup {
	@ObjField({description: 'Genre Group Name', example: 'A'})
	name!: string;
	@ObjField(() => [Genre])
	items!: Array<Genre>;
}

@ResultType({description: 'Genre Index'})
export class GenreIndex {
	@ObjField({description: 'Last Change Timestamp'})
	lastModified!: number;
	@ObjField(() => [GenreIndexGroup], {description: 'Genre Index Groups'})
	groups!: Array<GenreIndexGroup>;
}
