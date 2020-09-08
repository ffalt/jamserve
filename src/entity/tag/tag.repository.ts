import {BaseRepository} from '../base/base.repository';
import {Tag} from './tag';
import {DBObjectType} from '../../types/enums';
import {User} from '../user/user';
import {FindOptions, OrderItem} from '../../modules/orm';
import {AudioScanResult} from '../../modules/audio/audio.module';
import {basenameStripExt} from '../../utils/fs-utils';
import {DefaultOrderArgs} from '../base/base.args';

export class TagRepository extends BaseRepository<Tag, void, DefaultOrderArgs> {
	objType = DBObjectType.tag;

	createByScan(data: AudioScanResult, filename: string): Tag {
		return this.create({...data, title: data.title || basenameStripExt(filename), chapters: data.chapters ? JSON.stringify(data.chapters) : undefined});
	}

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: void, __?: User): Promise<FindOptions<Tag>> {
		return {};
	}

}
