import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'AutoComplete Entry' })
export class AutoCompleteEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Awesome' })
	name!: string;
}

@ResultType({ description: 'AutoComplete' })
export class AutoComplete {
	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Tracks' })
	tracks?: Array<AutoCompleteEntry>;

	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Artists' })
	artists?: Array<AutoCompleteEntry>;

	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Albums' })
	albums?: Array<AutoCompleteEntry>;

	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Folder' })
	folders?: Array<AutoCompleteEntry>;

	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Playlist' })
	playlists?: Array<AutoCompleteEntry>;

	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Podcasts' })
	podcasts?: Array<AutoCompleteEntry>;

	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Episode' })
	episodes?: Array<AutoCompleteEntry>;

	@ObjectField(() => AutoCompleteEntry, { nullable: true, description: 'Autocomplete Series' })
	series?: Array<AutoCompleteEntry>;
}
