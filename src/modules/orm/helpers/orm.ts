import {EntityManager} from './manager';
import {Sequelize} from 'sequelize';
import {getMetadataStorage} from '../metadata';
import {ORMConfig} from '../definitions/config';
import {ModelBuilder} from '../builder/schema';

export class SchemaGenerator {

	constructor(private sequelize: Sequelize) {
	}

	async dropSchema(): Promise<void> {
		await this.sequelize.drop();
	}

	async ensureDatabase(): Promise<void> {
		await this.sequelize.sync();
	}
}

export class ORM {
	static async init(config: ORMConfig): Promise<ORM> {
		const sequelize = new Sequelize({
			dialect: 'sqlite',
			logging: false,
			logQueryParameters: false,
			retry: {max: 0},
			storage: config.storage
		});
		const orm = new ORM(sequelize, config);
		await orm.init();
		return orm;
	}

	constructor(private sequelize: Sequelize, private config: ORMConfig) {
	}

	async init(): Promise<void> {
		const metadata = getMetadataStorage();
		metadata.build();
		await this.testConnection();
		await this.buildSchema();
	}

	async testConnection(): Promise<void> {
		await this.sequelize.authenticate();
	}

	async buildSchema(): Promise<void> {
		const schema = new ModelBuilder(this.sequelize, getMetadataStorage());
		await schema.build();
	}

	manager(): EntityManager {
		return new EntityManager(this.sequelize, getMetadataStorage(), this.config);
	}

	async close(): Promise<void> {
		await this.sequelize.close();
	}

	getSchemaGenerator(): SchemaGenerator {
		return new SchemaGenerator(this.sequelize);
	}
}
