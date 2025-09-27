import { EntityCache, EntityManager } from './manager.js';
import { Sequelize, DataTypes } from 'sequelize';
import { metadataStorage } from '../metadata/metadata-storage.js';
import { ModelBuilder } from '../builder/schema.js';
export class ORM {
    static async init(config) {
        const sequelize = new Sequelize(config.options);
        const orm = new ORM(sequelize, config);
        await orm.init();
        return orm;
    }
    constructor(sequelize, config) {
        this.sequelize = sequelize;
        this.config = config;
        this.cache = new EntityCache();
    }
    async init() {
        const metadata = metadataStorage();
        metadata.build();
        await this.testConnection();
        await this.buildSchema();
    }
    async dropSchema() {
        await this.sequelize.drop();
    }
    async findSchema(queryInterface, name) {
        return await queryInterface.describeTable(name);
    }
    async updateSchema() {
        const queryInterface = this.sequelize.getQueryInterface();
        let table = await this.findSchema(queryInterface, 'State');
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
    async ensureSchema() {
        await this.sequelize.sync();
        await this.updateSchema();
    }
    async testConnection() {
        await this.sequelize.authenticate();
    }
    async buildSchema() {
        const schema = new ModelBuilder(this.sequelize, metadataStorage());
        await schema.build();
    }
    manager(useCache) {
        return new EntityManager(this.sequelize, metadataStorage(), this.config, this, useCache);
    }
    clearCache() {
        this.cache.clear();
    }
    async close() {
        await this.sequelize.close();
    }
}
//# sourceMappingURL=orm.js.map