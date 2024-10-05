import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { DefaultOrderArgs } from '../base/base.args.js';
import { User } from '../user/user.js';
import { FindOptions, IDEntity, OrderItem, QHelper } from '../../modules/orm/index.js';
import { Subsonic } from './subsonic.js';
import { SubsonicFilterArgs } from './subsonic.args.js';
import { SubsonicFormatter } from '../../modules/subsonic/formatter.js';

export class SubsonicRepository extends BaseRepository<Subsonic, SubsonicFilterArgs, DefaultOrderArgs> {
	objType = DBObjectType.subsonic;
	indexProperty = 'jamID';

	public async jamID(subsonicID: number): Promise<string | undefined> {
		const entry = await this.findOne({ where: { subsonicID } });
		return entry?.jamID;
	}

	public async subsonicID(jamID: string): Promise<number> {
		const entry = await this.findOne({ where: { jamID } });
		if (entry) {
			return entry.subsonicID;
		}
		const subsonic = this.create({ jamID, subsonicID: await this.count() + 1000 });
		await this.persistAndFlush(subsonic);

		return subsonic.subsonicID;
	}

	public async jamIDOrFail(subsonicID: number): Promise<string> {
		const id = await this.jamID(subsonicID);
		if (!id) {
			return Promise.reject(SubsonicFormatter.ERRORS.NOT_FOUND);
		}
		return id;
	}

	public async mayBeJamID(subsonicID?: number): Promise<string | undefined> {
		if (!subsonicID) {
			return undefined;
		}
		return this.jamID(subsonicID);
	}

	public async jamIDs(subsonicIDs: Array<number>): Promise<Array<string>> {
		const result: Array<string> = [];
		for (const id of subsonicIDs) {
			result.push(await this.jamIDOrFail(id));
		}
		return result;
	}

	public async mayBeSubsonicID(id?: string): Promise<number | undefined> {
		if (!id) {
			return undefined;
		}
		return await this.subsonicID(id);
	}

	public async findOneSubsonicOrFailByID<T extends IDEntity, Filter, OrderBy extends { orderDesc?: boolean }>(subsonicID: number, repo: BaseRepository<T, Filter, OrderBy>): Promise<T> {
		const id = await this.jamIDOrFail(subsonicID);
		const item = await repo.findOneByID(id);
		if (!item) {
			return Promise.reject(SubsonicFormatter.ERRORS.NOT_FOUND);
		}
		return item;
	}

	buildOrder(order?: DefaultOrderArgs): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: SubsonicFilterArgs, _?: User): Promise<FindOptions<Subsonic>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Subsonic>(
			[
				{ jamID: filter.jamID },
				{ subsonicID: filter.subsonicID }
			]
		);
		return result;
	}
}
