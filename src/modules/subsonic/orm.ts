import { IDEntity } from '../orm/index.js';
import { BaseRepository } from '../../entity/base/base.repository.js';
import { InRequestScope } from 'typescript-ioc';
import { DataTypes, Model, Sequelize } from 'sequelize';
import { ConfigService } from '../engine/services/config.service.js';
import path from 'path';

class Subsonic extends Model {
	id!: number;
	jamID!: string;
}

@InRequestScope
export class SubsonicORM {
	sequelize!: Sequelize;

	async init(config: ConfigService) {
		this.sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: path.resolve(config.env.paths.data, 'subsonic.sqlite')
		});
		Subsonic.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true
				},
				jamID: {
					type: DataTypes.UUIDV4,
					allowNull: false,
					unique: true
				}
			}, { sequelize: this.sequelize, modelName: 'subsonic' }
		);
		await this.sequelize.sync();
	}

	public async jamID(subsonicID: number): Promise<string | undefined> {
		const entry = await Subsonic.findByPk(subsonicID);
		return entry?.jamID;
	}

	public async jamIDOrFail(subsonicID: number): Promise<string> {
		const id = await this.jamID(subsonicID);
		if (!id) {
			throw new Error(`Object not found`);
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
		return Promise.all(subsonicIDs.map(async id => this.jamIDOrFail(id)));
	}

	public async mayBeSubsonicID(id?: string): Promise<number | undefined> {
		if (!id) {
			return undefined;
		}
		return await this.subsonicID(id);
	}

	public async subsonicID(id: string): Promise<number> {
		const [entry, _created] = await Subsonic.findOrCreate({
			where: { jamID: id },
			defaults: { jamID: id }
		});
		return entry.id;
	}

	public async findOneOrFailByID<T extends IDEntity, Filter, OrderBy extends { orderDesc?: boolean }>(subsonicID: number, repo: BaseRepository<T, Filter, OrderBy>): Promise<T> {
		const id = await this.jamIDOrFail(subsonicID);
		return repo.findOneOrFailByID(id);
	}
}
