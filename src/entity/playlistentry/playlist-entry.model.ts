import { MediaBase } from '../tag/tag.model.js';
import { Page } from '../base/base.model.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Playlist Entry Page' })
export class PlaylistEntryPage extends Page {
	@ObjField(() => MediaBase, { description: 'List of Playlist Entries' })
	items!: Array<MediaBase>;
}
