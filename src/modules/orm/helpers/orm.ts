import { EntityCache, EntityManager } from './manager.js';
import seq, { Sequelize } from 'sequelize';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
import { ORMConfig } from '../definitions/config.js';
import { ModelBuilder } from '../builder/schema.js';
export class ORM {
	public cache = new EntityCache();

	static async init(config: ORMConfig): Promise<ORM> {
		const sequelize = new Sequelize(config.options);
		const orm = new ORM(sequelize, config);
		await orm.init();
		return orm;
	}

	constructor(public sequelize: Sequelize, private config: ORMConfig) {
	}

	async init(): Promise<void> {
		const metadata = getMetadataStorage();
		metadata.build();
		await this.testConnection();
		await this.buildSchema();
	}

	async dropSchema(): Promise<void> {
		await this.sequelize.drop();
	}

	async updateSchema(): Promise<void> {
		// TODO: run migration only if needed
		const queryInterface = this.sequelize.getQueryInterface();
		let table = await queryInterface.describeTable('State');
		if (table?.played && table.played.type !== 'INTEGER') {
			await queryInterface.removeColumn('State', 'played');
			await queryInterface.addColumn('State', 'played', { type: seq.DataTypes.INTEGER, allowNull: true });
		}
		table = await queryInterface.describeTable('Artist');
		if (table?.genres) {
			await queryInterface.removeColumn('Artist', 'genres');
		}
		table = await queryInterface.describeTable('Folder');
		if (table?.genres) {
			await queryInterface.removeColumn('Folder', 'genres');
		}
		table = await queryInterface.describeTable('Album');
		if (table?.genres) {
			await queryInterface.removeColumn('Album', 'genres');
		}
		table = await queryInterface.describeTable('User');
		if (table?.salt) {
			await queryInterface.removeColumn('User', 'salt');
		}
		table = await queryInterface.describeTable('Tag');
		if (!table?.mediaBitDepth) {
			await queryInterface.addColumn('Tag', 'mediaBitDepth', { type: seq.DataTypes.INTEGER, allowNull: true });
		}
	}

	async ensureSchema(): Promise<void> {
		await this.sequelize.sync();
		await this.updateSchema();
	}

	async testConnection(): Promise<void> {
		await this.sequelize.authenticate();
	}

	async buildSchema(): Promise<void> {
		const schema = new ModelBuilder(this.sequelize, getMetadataStorage());
		await schema.build();
	}

	manager(useCache: boolean): EntityManager {
		return new EntityManager(this.sequelize, getMetadataStorage(), this.config, this, useCache);
	}

	clearCache(): void {
		this.cache.clear();
	}

	async close(): Promise<void> {
		await this.sequelize.close();
	}
}
