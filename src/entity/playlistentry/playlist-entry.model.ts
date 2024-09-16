import {ObjField, ResultType} from '../../modules/rest/index.js';
import {MediaBase} from '../tag/tag.model.js';
import {Page} from '../base/base.model.js';

@ResultType({description: 'Playlist Entry Page'})
export class PlaylistEntryPage extends Page {
	@ObjField(() => MediaBase, {description: 'List of Playlist Entries'})
	items!: Array<MediaBase>;
}
