import { BaseRepository } from '../base/base.repository.js';
import { Tag } from './tag.js';
import { DBObjectType } from '../../types/enums.js';
import { User } from '../user/user.js';
import { AudioScanResult } from '../../modules/audio/audio.module.js';
import { basenameStripExtension } from '../../utils/fs-utils.js';
import { DefaultOrderParameters } from '../base/base.parameters.js';
import { FindOptions, OrderItem } from 'sequelize';

export class TagRepository extends BaseRepository<Tag, void, DefaultOrderParameters> {
	objType = DBObjectType.tag;

	createByScan(data: AudioScanResult, filename: string): Tag {
		return this.create({ ...data, title: data.title ?? basenameStripExtension(filename), chapters: data.chapters ? JSON.stringify(data.chapters) : undefined });
	}

	buildOrder(_?: DefaultOrderParameters): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: unknown, __?: User): Promise<FindOptions<Tag>> {
		return {};
	}
}
