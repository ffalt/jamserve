import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'AutoComplete Entry' })
export class AutoCompleteEntry {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Name', example: 'Awesome' })
	name!: string;
}

@ResultType({ description: 'AutoComplete' })
export class AutoComplete {
	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Tracks' })
	tracks?: Array<AutoCompleteEntry>;

	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Artists' })
	artists?: Array<AutoCompleteEntry>;

	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Albums' })
	albums?: Array<AutoCompleteEntry>;

	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Folder' })
	folders?: Array<AutoCompleteEntry>;

	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Playlist' })
	playlists?: Array<AutoCompleteEntry>;

	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Podcasts' })
	podcasts?: Array<AutoCompleteEntry>;

	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Episode' })
	episodes?: Array<AutoCompleteEntry>;

	@ObjField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Series' })
	series?: Array<AutoCompleteEntry>;
}
