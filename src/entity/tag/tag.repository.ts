import {BaseRepository} from '../base/base.repository.js';
import {Tag} from './tag.js';
import {DBObjectType} from '../../types/enums.js';
import {User} from '../user/user.js';
import {FindOptions, OrderItem} from '../../modules/orm/index.js';
import {AudioScanResult} from '../../modules/audio/audio.module.js';
import {basenameStripExt} from '../../utils/fs-utils.js';
import {DefaultOrderArgs} from '../base/base.args.js';

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
