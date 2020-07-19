import {ObjField, ResultType} from '../../modules/rest/decorators';
import {MediaBase} from '../tag/tag.model';
import {Page} from '../base/base.model';

@ResultType({description: 'Playlist Entry Page'})
export class PlaylistEntryPage extends Page {
	@ObjField(() => MediaBase, {description: 'List of Playlist Entries'})
	items!: Array<MediaBase>;
}
