import { MediaBase } from '../tag/tag.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Playlist Entry Page' })
export class PlaylistEntryPage extends Page {
	@ObjectField(() => MediaBase, { description: 'List of Playlist Entries' })
	items!: Array<MediaBase>;
}
