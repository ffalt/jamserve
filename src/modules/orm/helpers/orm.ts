import { EntityCache, EntityManager } from './manager.js';
import { Sequelize, DataTypes } from 'sequelize';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { ORMConfig } from '../definitions/config.js';
import { ModelBuilder } from '../builder/schema.js';
import { ColumnDescription, QueryInterface } from 'sequelize/lib/dialects/abstract/query-interface';

export class ORM {
	public readonly cache = new EntityCache();

	static async init(config: ORMConfig): Promise<ORM> {
		const sequelize = new Sequelize(config.options);
		const orm = new ORM(sequelize, config);
		await orm.init();
		return orm;
	}

	constructor(public readonly sequelize: Sequelize, private readonly config: ORMConfig) {
	}

	async init(): Promise<void> {
		const metadata = metadataStorage();
		metadata.build();
		await this.testConnection();
		await this.buildSchema();
	}

	async dropSchema(): Promise<void> {
		await this.sequelize.drop();
	}

	async findSchema(queryInterface: QueryInterface, name: string): Promise<Record<string, ColumnDescription | undefined> | undefined> {
		return await queryInterface.describeTable(name);
	}

	async updateSchema(): Promise<void> {
		const queryInterface = this.sequelize.getQueryInterface();
		let table: Record<string, ColumnDescription | undefined> | undefined = await this.findSchema(queryInterface, 'State');
		if (table?.played && table.played.type !== 'INTEGER') {
			await queryInterface.removeColumn('State', 'played');
			await queryInterface.addColumn('State', 'played', { type: DataTypes.INTEGER, allowNull: true });
		}
		table = await this.findSchema(queryInterface, 'Artist');
		if (table?.genres) {
			await queryInterface.removeColumn('Artist', 'genres');
		}
		table = await this.findSchema(queryInterface, 'Folder');
		if (table?.genres) {
			await queryInterface.removeColumn('Folder', 'genres');
		}
		table = await this.findSchema(queryInterface, 'Album');
		if (table?.genres) {
			await queryInterface.removeColumn('Album', 'genres');
		}
		table = await this.findSchema(queryInterface, 'User');
		if (table?.salt) {
			await queryInterface.removeColumn('User', 'salt');
		}
		table = await this.findSchema(queryInterface, 'Tag');
		if (!table?.mediaBitDepth) {
			await queryInterface.addColumn('Tag', 'mediaBitDepth', { type: DataTypes.INTEGER, allowNull: true });
		}
		if (!table?.syncedlyrics) {
			await queryInterface.addColumn('Tag', 'syncedlyrics', { type: DataTypes.TEXT, allowNull: true });
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
		const schema = new ModelBuilder(this.sequelize, metadataStorage());
		await schema.build();
	}

	manager(useCache: boolean): EntityManager {
		return new EntityManager(this.sequelize, metadataStorage(), this.config, this, useCache);
	}

	clearCache(): void {
		this.cache.clear();
	}

	async close(): Promise<void> {
		await this.sequelize.close();
	}
}
