"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
const repository_1 = require("./repository");
const entity_1 = require("./entity");
class EntityManager {
    constructor(sequelize, metadata, config) {
        this.sequelize = sequelize;
        this.metadata = metadata;
        this.config = config;
        this.repositoryMap = {};
        this.changeSet = [];
    }
    getRepository(entityName) {
        entityName = typeof entityName === 'string' ? entityName : entityName.name;
        if (!this.repositoryMap[entityName]) {
            if (this.config.repositories[entityName]) {
                const RepositoryClass = this.config.repositories[entityName];
                this.repositoryMap[entityName] = new RepositoryClass(this, entityName);
            }
            else {
                this.repositoryMap[entityName] = new repository_1.EntityRepository(this, entityName);
            }
        }
        return this.repositoryMap[entityName];
    }
    persistAndFlush(entityName, entity) {
        this.persistLater(entityName, entity);
        return this.flush();
    }
    persistLater(entityName, entity) {
        let entities = Array.isArray(entity) ? entity : [entity];
        entities = entities.filter(e => !this.changeSet.find(c => c.persist === e));
        this.changeSet.push(...(entities.map(e => ({ entityName: entityName, persist: e }))));
    }
    async flush() {
        if (this.changeSet.length === 0) {
            return;
        }
        const t = await this.sequelize.transaction();
        try {
            for (const change of this.changeSet) {
                if (change.persist) {
                    entity_1.mapManagedToSource(change.persist);
                    await change.persist._source.save({ transaction: t });
                }
                else if (change.remove && change.remove.entity) {
                    await change.remove.entity._source.destroy({ transaction: t });
                }
                else if (change.remove && change.remove.query) {
                    const model = this.model(change.entityName);
                    change.remove.resultCount = await model.destroy({ where: change.remove.query.where, transaction: t });
                }
            }
            for (const change of this.changeSet) {
                if (change.persist) {
                    await entity_1.saveManagedEntityRelations(change.persist, t);
                }
            }
            for (const change of this.changeSet) {
                if (change.persist) {
                    entity_1.cleanManagedEntityRelations(change.persist);
                }
            }
            this.changeSet = [];
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    persist(entityName, entity, flush = false) {
        if (flush) {
            return this.persistAndFlush(entityName, entity);
        }
        else {
            this.persistLater(entityName, entity);
        }
    }
    async findOne(entityName, options) {
        const model = this.model(entityName);
        const source = await model.findOne(options);
        if (!source) {
            return;
        }
        return this.mapEntity(entityName, source);
    }
    async findOneByID(entityName, id) {
        if (!id || id.trim().length === 0) {
            return Promise.reject(Error('Invalid ID'));
        }
        const model = this.model(entityName);
        const source = await model.findOne({ where: { id } });
        if (!source) {
            return;
        }
        return this.mapEntity(entityName, source);
    }
    async findOneOrFail(entityName, options) {
        const result = await this.findOne(entityName, options);
        if (!result) {
            throw new Error(`${entityName} not found`);
        }
        return result;
    }
    async findOneOrFailByID(entityName, id) {
        const result = await this.findOneByID(entityName, id);
        if (!result) {
            throw new Error(`${entityName} not found`);
        }
        return result;
    }
    async all(entityName) {
        return this.find(entityName, {});
    }
    findByIDs(entityName, ids) {
        return this.find(entityName, { where: { id: ids } });
    }
    async find(entityName, options) {
        const model = this.model(entityName);
        const rows = await model.findAll(options);
        return rows.map(source => this.mapEntity(entityName, source));
    }
    async findOneID(entityName, options) {
        const model = this.model(entityName);
        options.attributes = ['id'];
        const result = await model.findOne(options);
        if (result) {
            return result.id;
        }
    }
    async findIDs(entityName, options) {
        const model = this.model(entityName);
        options.attributes = ['id'];
        const result = await model.findAll(options);
        return result.map((o) => o.id);
    }
    async findAndCount(entityName, options) {
        const model = this.model(entityName);
        const { count, rows } = await model.findAndCountAll(options);
        return { count, entities: rows.map(source => this.mapEntity(entityName, source)) };
    }
    async count(entityName, options = {}) {
        return await this.model(entityName).count(options);
    }
    model(entityName) {
        return this.sequelize.model(entityName);
    }
    mapEntity(entityName, source) {
        const meta = this.metadata.entities.find(e => e.name === entityName);
        if (!meta) {
            throw Error('Invalid ORM setup');
        }
        return entity_1.createManagedEntity(meta, source, this);
    }
    create(entityName, data) {
        const _source = this.model(entityName).build(data);
        const entity = this.mapEntity(entityName, _source);
        Object.keys(data).forEach(key => entity[key] = data[key]);
        return entity;
    }
    remove(entityName, entity, flush) {
        if (flush) {
            return this.removeAndFlush(entityName, entity);
        }
        else {
            this.removeLater(entityName, entity);
        }
    }
    async removeAndFlush(entityName, entity) {
        this.removeLater(entityName, entity);
        await this.flush();
    }
    removeLater(entityName, entity) {
        const entities = Array.isArray(entity) ? entity : [entity];
        this.changeSet.push(...(entities.map(e => ({ entityName: entityName, remove: { entity: e } }))));
    }
    async removeByQueryAndFlush(entityName, options) {
        const change = { entityName: entityName, remove: { query: options, resultCount: 0 } };
        this.changeSet.push(change);
        await this.flush();
        return change.remove.resultCount;
    }
    hasChanges() {
        return this.changeSet.length > 0;
    }
    changesCount() {
        return this.changeSet.length;
    }
}
exports.EntityManager = EntityManager;
//# sourceMappingURL=manager.js.map