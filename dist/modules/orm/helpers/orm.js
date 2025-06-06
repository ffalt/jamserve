import { EntityCache, EntityManager } from './manager.js';
import seq, { Sequelize } from 'sequelize';
import { getMetadataStorage } from '../metadata/getMetadataStorage.js';
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
        const metadata = getMetadataStorage();
        metadata.build();
        await this.testConnection();
        await this.buildSchema();
    }
    async dropSchema() {
        await this.sequelize.drop();
    }
    async updateSchema() {
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
        if (!table?.syncedlyrics) {
            await queryInterface.addColumn('Tag', 'syncedlyrics', { type: seq.DataTypes.TEXT, allowNull: true });
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
        const schema = new ModelBuilder(this.sequelize, getMetadataStorage());
        await schema.build();
    }
    manager(useCache) {
        return new EntityManager(this.sequelize, getMetadataStorage(), this.config, this, useCache);
    }
    clearCache() {
        this.cache.clear();
    }
    async close() {
        await this.sequelize.close();
    }
}
//# sourceMappingURL=orm.js.map