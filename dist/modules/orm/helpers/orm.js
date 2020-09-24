"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORM = void 0;
const manager_1 = require("./manager");
const sequelize_1 = require("sequelize");
const metadata_1 = require("../metadata");
const schema_1 = require("../builder/schema");
class ORM {
    constructor(sequelize, config) {
        this.sequelize = sequelize;
        this.config = config;
        this.cache = new manager_1.EntityCache();
    }
    static async init(config) {
        const sequelize = new sequelize_1.Sequelize(config.options);
        const orm = new ORM(sequelize, config);
        await orm.init();
        return orm;
    }
    async init() {
        const metadata = metadata_1.getMetadataStorage();
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
        if ((table === null || table === void 0 ? void 0 : table.played) && table.played.type !== 'INTEGER') {
            await queryInterface.removeColumn('State', 'played');
            await queryInterface.addColumn('State', 'played', { type: sequelize_1.DataTypes.INTEGER, allowNull: true });
        }
        table = await queryInterface.describeTable('Artist');
        if (table === null || table === void 0 ? void 0 : table.genres) {
            await queryInterface.removeColumn('Artist', 'genres');
        }
        table = await queryInterface.describeTable('Folder');
        if (table === null || table === void 0 ? void 0 : table.genres) {
            await queryInterface.removeColumn('Folder', 'genres');
        }
        table = await queryInterface.describeTable('Album');
        if (table === null || table === void 0 ? void 0 : table.genres) {
            await queryInterface.removeColumn('Album', 'genres');
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
        const schema = new schema_1.ModelBuilder(this.sequelize, metadata_1.getMetadataStorage());
        await schema.build();
    }
    manager(useCache) {
        return new manager_1.EntityManager(this.sequelize, metadata_1.getMetadataStorage(), this.config, this, useCache);
    }
    clearCache() {
        this.cache.clear();
    }
    async close() {
        await this.sequelize.close();
    }
}
exports.ORM = ORM;
//# sourceMappingURL=orm.js.map