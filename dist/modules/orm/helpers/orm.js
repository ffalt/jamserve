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
    }
    static async init(config) {
        const sequelize = new sequelize_1.Sequelize({
            dialect: 'sqlite',
            logging: false,
            logQueryParameters: false,
            retry: { max: 0 },
            storage: config.storage
        });
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
    async ensureDatabase() {
        await this.sequelize.sync();
    }
    async testConnection() {
        await this.sequelize.authenticate();
    }
    async buildSchema() {
        const schema = new schema_1.ModelBuilder(this.sequelize, metadata_1.getMetadataStorage());
        await schema.build();
    }
    manager() {
        return new manager_1.EntityManager(this.sequelize, metadata_1.getMetadataStorage(), this.config);
    }
    async close() {
        await this.sequelize.close();
    }
}
exports.ORM = ORM;
//# sourceMappingURL=orm.js.map